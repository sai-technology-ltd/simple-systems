import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import { createHmac, timingSafeEqual } from 'crypto';
import { ClientService } from '../client.service';

type PaymentProvider = 'LEMON_SQUEEZY' | 'PADDLE' | 'PAYSTACK';

type InitializeInput = {
  email: string;
  amount?: number;
  callbackUrl?: string;
};

type LemonSqueezyCheckoutResponse = {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
};

type LemonSqueezyOrderWebhook = {
  meta?: {
    event_name?: string;
    custom_data?: Record<string, unknown>;
  };
  data: {
    id: string;
    attributes?: {
      identifier?: string;
      user_email?: string;
      total?: number;
      status?: string;
    };
  };
};

type PaddleTransactionResponse = {
  data: {
    id: string;
    status: string;
    checkout?: {
      url?: string | null;
    } | null;
  };
};

type PaddleWebhook = {
  event_type?: string;
  data?: {
    id: string;
    status?: string;
    custom_data?: Record<string, unknown> | null;
    customer?: {
      email?: string | null;
    } | null;
    details?: {
      totals?: {
        total?: number;
      } | null;
    } | null;
  };
};

type PaystackInitializeResponse = {
  data?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
  };
};

type PaystackVerifyResponse = {
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    customer?: {
      email?: string | null;
    } | null;
  };
};

type PaystackWebhook = {
  event?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    customer?: {
      email?: string | null;
    } | null;
    metadata?: Record<string, unknown> | null;
  } | null;
};

function readString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly config: ConfigService,
    private readonly clients: ClientService,
  ) {}

  private get provider(): PaymentProvider {
    return (
      this.config.get<PaymentProvider>('PAYMENT_PROVIDER') ?? 'LEMON_SQUEEZY'
    );
  }

  private get providerName() {
    switch (this.provider) {
      case 'PADDLE':
        return 'paddle';
      case 'PAYSTACK':
        return 'paystack';
      case 'LEMON_SQUEEZY':
      default:
        return 'lemonsqueezy';
    }
  }

  private get defaultAmount() {
    switch (this.provider) {
      case 'PADDLE':
        return Number(
          this.config.get<number>('PADDLE_DEFAULT_AMOUNT') ?? 500000,
        );
      case 'PAYSTACK':
        return Number(
          this.config.get<number>('PAYSTACK_DEFAULT_AMOUNT') ?? 500000,
        );
      case 'LEMON_SQUEEZY':
      default:
        return Number(
          this.config.get<number>('LEMON_SQUEEZY_DEFAULT_AMOUNT') ?? 500000,
        );
    }
  }

  private get lemonSqueezyApiKey() {
    return this.config.get<string>('LEMON_SQUEEZY_API_KEY');
  }

  private get lemonSqueezyStoreId() {
    return this.config.get<number>('LEMON_SQUEEZY_STORE_ID');
  }

  private get lemonSqueezyVariantId() {
    return this.config.get<number>('LEMON_SQUEEZY_VARIANT_ID');
  }

  private get lemonSqueezyWebhookSecret() {
    return this.config.get<string>('LEMON_SQUEEZY_WEBHOOK_SECRET');
  }

  private get lemonSqueezyTestMode() {
    return Boolean(
      this.config.get<boolean>('LEMON_SQUEEZY_TEST_MODE') ?? false,
    );
  }

  private get paddleApiKey() {
    return this.config.get<string>('PADDLE_API_KEY');
  }

  private get paddlePriceId() {
    return this.config.get<string>('PADDLE_PRICE_ID');
  }

  private get paddleWebhookSecret() {
    return this.config.get<string>('PADDLE_WEBHOOK_SECRET');
  }

  private get paddleDefaultCurrencyCode() {
    return this.config.get<string>('PADDLE_DEFAULT_CURRENCY_CODE') ?? 'USD';
  }

  private get paystackSecretKey() {
    return this.config.get<string>('PAYSTACK_SECRET_KEY');
  }

  private get paystackDefaultCurrencyCode() {
    return this.config.get<string>('PAYSTACK_DEFAULT_CURRENCY_CODE') ?? 'NGN';
  }

  private assertLemonSqueezyEnabled() {
    if (
      !this.lemonSqueezyApiKey ||
      !this.lemonSqueezyStoreId ||
      !this.lemonSqueezyVariantId
    ) {
      throw new BadRequestException('Lemon Squeezy is not configured');
    }
  }

  private assertPaddleEnabled() {
    if (!this.paddleApiKey || !this.paddlePriceId) {
      throw new BadRequestException('Paddle is not configured');
    }
  }

  private assertLemonSqueezyWebhookEnabled() {
    if (!this.lemonSqueezyWebhookSecret) {
      throw new UnauthorizedException(
        'Lemon Squeezy webhook secret is not configured',
      );
    }
  }

  private assertPaddleWebhookEnabled() {
    if (!this.paddleWebhookSecret) {
      throw new UnauthorizedException(
        'Paddle webhook secret is not configured',
      );
    }
  }

  private assertPaystackEnabled() {
    if (!this.paystackSecretKey) {
      throw new BadRequestException('Paystack is not configured');
    }
  }

  private async lemonSqueezyRequest<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    this.assertLemonSqueezyEnabled();

    const res = await fetch(`https://api.lemonsqueezy.com${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.lemonSqueezyApiKey}`,
        'Content-Type': 'application/vnd.api+json',
        ...(init?.headers ?? {}),
      },
    });

    const json = (await res.json()) as T;
    if (!res.ok) throw new BadRequestException('Lemon Squeezy request failed');
    return json;
  }

  private async paddleRequest<T>(path: string, init?: RequestInit): Promise<T> {
    this.assertPaddleEnabled();

    const res = await fetch(`https://api.paddle.com${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.paddleApiKey}`,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    const json = (await res.json()) as T;
    if (!res.ok) throw new BadRequestException('Paddle request failed');
    return json;
  }

  private async paystackRequest<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    this.assertPaystackEnabled();

    const res = await fetch(`https://api.paystack.co${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    const json = (await res.json()) as T;
    if (!res.ok) throw new BadRequestException('Paystack request failed');
    return json;
  }

  async initialize(clientSlug: string, input: InitializeInput) {
    switch (this.provider) {
      case 'PAYSTACK':
        return this.initializePaystack(clientSlug, input);
      case 'PADDLE':
        return this.initializePaddle(clientSlug, input);
      case 'LEMON_SQUEEZY':
      default:
        return this.initializeLemonSqueezy(clientSlug, input);
    }
  }

  async verify(clientSlug: string, reference: string) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');
    if (client.paymentReference !== reference) {
      throw new BadRequestException(
        'Payment reference does not match this client',
      );
    }

    if (
      client.paymentStatus !== PaymentStatus.PAID &&
      this.provider === 'PAYSTACK'
    ) {
      const verified = await this.verifyPaystackPayment(client.id, reference);
      if (verified) {
        return verified;
      }
    }

    return {
      paid: client.paymentStatus === 'PAID',
      status: client.paymentStatus.toLowerCase(),
      provider: this.providerName,
      reference: client.paymentReference,
      amount: client.paymentAmount ?? null,
      paidAt:
        client.paymentStatus === 'PAID' ? client.updatedAt.toISOString() : null,
    };
  }

  async handleLemonSqueezyWebhook(
    rawBody: string,
    signature: string,
    eventName?: string,
  ) {
    this.assertLemonSqueezyWebhookEnabled();

    const expected = Buffer.from(
      createHmac('sha256', this.lemonSqueezyWebhookSecret as string)
        .update(rawBody)
        .digest('hex'),
      'utf8',
    );
    const received = Buffer.from(signature, 'utf8');

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new UnauthorizedException('Invalid Lemon Squeezy signature');
    }

    const payload = JSON.parse(rawBody) as LemonSqueezyOrderWebhook;
    const name = eventName ?? payload.meta?.event_name ?? '';

    if (name !== 'order_created') {
      return {
        received: true,
        ignored: true,
        provider: 'lemonsqueezy',
        event: name || 'unknown',
      };
    }

    const clientSlug = readString(payload.meta?.custom_data?.clientSlug);
    const reference =
      readString(payload.meta?.custom_data?.reference) ||
      payload.data.attributes?.identifier ||
      payload.data.id;

    if (!clientSlug) {
      throw new BadRequestException(
        'Missing clientSlug in Lemon Squeezy webhook metadata',
      );
    }

    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    if (payload.data.attributes?.status === 'paid') {
      await this.clients.markPaymentPaid(client.id, {
        reference,
        email: payload.data.attributes.user_email,
        amount: payload.data.attributes.total,
      });
    }

    return {
      received: true,
      processed: true,
      provider: 'lemonsqueezy',
      event: name,
      reference,
    };
  }

  async handlePaddleWebhook(rawBody: string, signature: string) {
    this.assertPaddleWebhookEnabled();

    const parsed = this.parsePaddleSignature(signature);
    const signedPayload = `${parsed.timestamp}:${rawBody}`;
    const expected = Buffer.from(
      createHmac('sha256', this.paddleWebhookSecret as string)
        .update(signedPayload)
        .digest('hex'),
      'utf8',
    );

    const matches = parsed.signatures.some((candidate) => {
      const received = Buffer.from(candidate, 'utf8');
      return (
        expected.length === received.length &&
        timingSafeEqual(expected, received)
      );
    });

    if (!matches) {
      throw new UnauthorizedException('Invalid Paddle signature');
    }

    const payload = JSON.parse(rawBody) as PaddleWebhook;
    const event = payload.event_type ?? '';

    if (!['transaction.paid', 'transaction.completed'].includes(event)) {
      return {
        received: true,
        ignored: true,
        provider: 'paddle',
        event: event || 'unknown',
      };
    }

    const clientSlug = readString(payload.data?.custom_data?.clientSlug);
    const reference =
      readString(payload.data?.custom_data?.reference) ||
      payload.data?.id ||
      '';

    if (!clientSlug) {
      throw new BadRequestException(
        'Missing clientSlug in Paddle webhook custom_data',
      );
    }

    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    if (
      payload.data?.status === 'paid' ||
      payload.data?.status === 'completed'
    ) {
      await this.clients.markPaymentPaid(client.id, {
        reference,
        email: payload.data.customer?.email ?? undefined,
        amount: payload.data.details?.totals?.total ?? undefined,
      });
    }

    return {
      received: true,
      processed: true,
      provider: 'paddle',
      event,
      reference,
    };
  }

  async handlePaystackWebhook(rawBody: string, signature: string) {
    this.assertPaystackEnabled();

    const expected = Buffer.from(
      createHmac('sha512', this.paystackSecretKey as string)
        .update(rawBody)
        .digest('hex'),
      'utf8',
    );
    const received = Buffer.from(signature, 'utf8');

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new UnauthorizedException('Invalid Paystack signature');
    }

    const payload = JSON.parse(rawBody) as PaystackWebhook;
    const event = payload.event ?? '';

    if (event !== 'charge.success') {
      return {
        received: true,
        ignored: true,
        provider: 'paystack',
        event: event || 'unknown',
      };
    }

    const clientSlug = readString(payload.data?.metadata?.clientSlug);
    const reference =
      payload.data?.reference || readString(payload.data?.metadata?.reference);

    if (!clientSlug) {
      throw new BadRequestException(
        'Missing clientSlug in Paystack webhook metadata',
      );
    }

    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    if (payload.data?.status === 'success') {
      await this.clients.markPaymentPaid(client.id, {
        reference,
        email: payload.data.customer?.email ?? undefined,
        amount: payload.data.amount ?? undefined,
      });
    }

    return {
      received: true,
      processed: true,
      provider: 'paystack',
      event,
      reference,
    };
  }

  private async initializeLemonSqueezy(
    clientSlug: string,
    input: InitializeInput,
  ) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const reference = `ss_${clientSlug}_${Date.now()}`;
    const amount = input.amount ?? this.defaultAmount;

    const result = await this.lemonSqueezyRequest<LemonSqueezyCheckoutResponse>(
      '/v1/checkouts',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              custom_price: amount,
              checkout_data: {
                email: input.email,
                custom: {
                  clientSlug,
                  productType: client.productType,
                  reference,
                },
              },
              product_options: {
                enabled_variants: [this.lemonSqueezyVariantId],
                ...(input.callbackUrl
                  ? { redirect_url: input.callbackUrl }
                  : {}),
              },
              test_mode: this.lemonSqueezyTestMode,
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: String(this.lemonSqueezyStoreId),
                },
              },
              variant: {
                data: {
                  type: 'variants',
                  id: String(this.lemonSqueezyVariantId),
                },
              },
            },
          },
        }),
      },
    );

    if (!result.data?.attributes?.url) {
      throw new InternalServerErrorException(
        'Lemon Squeezy did not return a checkout URL',
      );
    }

    await this.clients.updatePaymentReference(client.id, reference);

    return {
      provider: 'lemonsqueezy',
      checkoutMode: 'overlay',
      reference,
      authorizationUrl: result.data.attributes.url,
      checkoutUrl: result.data.attributes.url,
      checkoutId: result.data.id,
      accessCode: null,
      amount,
    };
  }

  private async initializePaddle(clientSlug: string, input: InitializeInput) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const reference = `ss_${clientSlug}_${Date.now()}`;

    const result = await this.paddleRequest<PaddleTransactionResponse>(
      '/transactions',
      {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              price_id: this.paddlePriceId,
              quantity: 1,
            },
          ],
          collection_mode: 'automatic',
          currency_code: this.paddleDefaultCurrencyCode,
          custom_data: {
            clientSlug,
            productType: client.productType,
            reference,
            requestedAmount: input.amount ?? this.defaultAmount,
            email: input.email,
          },
          ...(input.callbackUrl
            ? { checkout: { url: input.callbackUrl } }
            : {}),
        }),
      },
    );

    if (!result.data?.checkout?.url) {
      throw new InternalServerErrorException(
        'Paddle did not return a checkout URL',
      );
    }

    await this.clients.updatePaymentReference(client.id, reference);

    return {
      provider: 'paddle',
      checkoutMode: 'overlay',
      reference,
      authorizationUrl: result.data.checkout.url,
      checkoutUrl: result.data.checkout.url,
      checkoutId: result.data.id,
      accessCode: null,
      amount: input.amount ?? this.defaultAmount,
    };
  }

  private async initializePaystack(clientSlug: string, input: InitializeInput) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const reference = `ss_${clientSlug}_${Date.now()}`;
    const amount = input.amount ?? this.defaultAmount;

    const result = await this.paystackRequest<PaystackInitializeResponse>(
      '/transaction/initialize',
      {
        method: 'POST',
        body: JSON.stringify({
          email: input.email,
          amount,
          currency: this.paystackDefaultCurrencyCode,
          reference,
          callback_url: input.callbackUrl,
          metadata: {
            clientSlug,
            productType: client.productType,
            reference,
          },
        }),
      },
    );

    if (
      !result.data?.authorization_url ||
      !result.data.access_code ||
      !result.data.reference
    ) {
      throw new InternalServerErrorException(
        'Paystack did not return checkout details',
      );
    }

    await this.clients.updatePaymentReference(client.id, reference);

    return {
      provider: 'paystack',
      checkoutMode: 'popup',
      reference: result.data.reference,
      authorizationUrl: result.data.authorization_url,
      checkoutUrl: result.data.authorization_url,
      checkoutId: result.data.reference,
      accessCode: result.data.access_code,
      amount,
    };
  }

  private parsePaddleSignature(signature: string) {
    const pairs = signature
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean);
    const timestamp = pairs.find((part) => part.startsWith('ts='))?.slice(3);
    const signatures = pairs
      .filter((part) => part.startsWith('h1='))
      .map((part) => part.slice(3));

    if (!timestamp || signatures.length === 0) {
      throw new UnauthorizedException('Malformed Paddle signature');
    }

    return { timestamp, signatures };
  }

  private async verifyPaystackPayment(clientId: string, reference: string) {
    const result = await this.paystackRequest<PaystackVerifyResponse>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
      { method: 'GET' },
    );

    if (result.data?.status !== 'success') {
      return null;
    }

    await this.clients.markPaymentPaid(clientId, {
      reference: result.data.reference ?? reference,
      email: result.data.customer?.email ?? undefined,
      amount: result.data.amount ?? undefined,
    });

    return {
      paid: true,
      status: 'paid',
      provider: 'paystack',
      reference: result.data.reference ?? reference,
      amount: result.data.amount ?? null,
      paidAt: new Date().toISOString(),
    };
  }
}
