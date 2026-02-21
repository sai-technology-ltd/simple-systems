import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { ClientService } from '../client.service';

@Injectable()
export class WebhookAuthService {
  constructor(private readonly clients: ClientService) {}

  async verify(clientSlug: string, rawBody: string, timestamp: string, signature: string) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new UnauthorizedException('Client not found');

    const ts = Number(timestamp);
    if (!Number.isFinite(ts)) throw new UnauthorizedException('Invalid webhook timestamp');

    const ageMs = Math.abs(Date.now() - ts * 1000);
    if (ageMs > 5 * 60 * 1000) throw new UnauthorizedException('Webhook timestamp expired');

    const expected = createHmac('sha256', client.webhookSecret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex');

    const ok = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!ok) throw new UnauthorizedException('Invalid webhook signature');

    return client;
  }
}
