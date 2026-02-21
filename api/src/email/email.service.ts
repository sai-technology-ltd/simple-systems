import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendApplicationReceived(input: {
    to: string;
    companyName: string;
    replyToEmail?: string | null;
    candidateName?: string;
  }) {
    const token = this.config.get<string>('POSTMARK_SERVER_TOKEN');
    if (!token || token === 'dummy') {
      this.logger.warn('POSTMARK_SERVER_TOKEN missing; skipping send');
      return { sent: false, reason: 'POSTMARK_NOT_CONFIGURED' };
    }

    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        From: 'notifications@simplehiring.app',
        To: input.to,
        ReplyTo: input.replyToEmail || undefined,
        Subject: `${input.companyName}: Application Received`,
        TextBody: `Hi ${input.candidateName || 'there'}, your application has been received.`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Postmark send failed: ${res.status} ${body}`);
      return { sent: false, reason: 'POSTMARK_ERROR' };
    }

    return { sent: true };
  }
}
