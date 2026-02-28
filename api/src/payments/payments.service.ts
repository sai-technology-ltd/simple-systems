import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientService } from '../client.service';

type InitResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type VerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    customer?: { email?: string };
    paid_at?: string;
  };
};

@Injectable()
export class PaymentsService {
  constructor(
    private readonly config: ConfigService,
    private readonly clients: ClientService,
  ) {}

  private get secret() {
    return this.config.get<string>('PAYSTACK_SECRET_KEY');
  }

  private get defaultAmountKobo() {
    return Number(this.config.get<string>('PAYSTACK_DEFAULT_AMOUNT_KOBO') ?? 500000);
  }

  private assertEnabled() {
    if (!this.secret) throw new BadRequestException('Paystack is not configured');
  }

  private async paystackRequest<T>(path: string, init?: RequestInit): Promise<T> {
    this.assertEnabled();
    const res = await fetch(`https://api.paystack.co${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.secret}`,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    const json = (await res.json()) as T;
    if (!res.ok) throw new BadRequestException('Paystack request failed');
    return json;
  }

  async initialize(clientSlug: string, input: { email: string; amountKobo?: number; callbackUrl?: string }) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const reference = `ss_${clientSlug}_${Date.now()}`;
    const amount = input.amountKobo ?? this.defaultAmountKobo;

    const result = await this.paystackRequest<InitResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        amount,
        reference,
        callback_url: input.callbackUrl,
        metadata: { clientSlug, productType: client.productType },
      }),
    });

    if (!result.status) throw new BadRequestException(result.message || 'Payment initialization failed');

    await this.clients.updatePaymentReference(client.id, reference);

    return {
      reference: result.data.reference,
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      amountKobo: amount,
    };
  }

  async verify(clientSlug: string, reference: string) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const result = await this.paystackRequest<VerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
    const paid = result.status && result.data.status === 'success';

    if (paid) {
      await this.clients.markPaymentPaid(client.id, {
        reference: result.data.reference,
        email: result.data.customer?.email,
        amountKobo: result.data.amount,
      });
    }

    return {
      paid,
      status: result.data.status,
      reference: result.data.reference,
      amountKobo: result.data.amount,
      paidAt: result.data.paid_at ?? null,
    };
  }
}
