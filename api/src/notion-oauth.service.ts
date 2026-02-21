import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { Prisma } from '@prisma/client';
import { ClientService } from './client.service';
import { CryptoService } from './crypto.service';
import { EventLogService } from './event-log.service';

type StatePayload = {
  clientId: string;
  nonce: string;
  issuedAt: number;
};

@Injectable()
export class NotionOauthService {
  constructor(
    private readonly config: ConfigService,
    private readonly clients: ClientService,
    private readonly crypto: CryptoService,
    private readonly eventLog: EventLogService,
  ) {}

  async getStartUrl(clientSlug: string, product = 'HIRING') {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Active client not found for slug');

    const state = this.signState({
      clientId: client.id,
      nonce: randomBytes(8).toString('hex'),
      issuedAt: Date.now(),
    });

    const clientId = this.config.getOrThrow<string>('NOTION_CLIENT_ID');
    const redirectUri = this.config.getOrThrow<string>('NOTION_REDIRECT_URI');

    const url = new URL('https://api.notion.com/v1/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('owner', 'user');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    // keep compatibility with existing query patterns
    url.searchParams.set('product', product);

    return { url: url.toString() };
  }

  async handleCallback(code: string, state: string) {
    const payload = this.verifyState(state);

    const clientSecret = this.config.getOrThrow<string>('NOTION_CLIENT_SECRET');
    const clientId = this.config.getOrThrow<string>('NOTION_CLIENT_ID');
    const redirectUri = this.config.getOrThrow<string>('NOTION_REDIRECT_URI');

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      throw new BadRequestException(`Notion token exchange failed: ${res.status}`);
    }

    const token = (await res.json()) as {
      access_token: string;
      workspace_id?: string;
      bot_id?: string;
      duplicated_template_id?: string;
      owner?: unknown;
      workspace_name?: string;
      workspace_icon?: string;
    };

    const encrypted = this.crypto.encrypt(token.access_token);

    await this.clients.markNotionConnected(payload.clientId, {
      notionWorkspaceId: token.workspace_id ?? '',
      notionBotId: token.bot_id ?? '',
      notionAccessTokenEnc: encrypted,
      notionTokenMeta: {
        workspace_name: token.workspace_name,
        workspace_icon: token.workspace_icon,
        owner: token.owner ? (token.owner as Prisma.JsonObject) : null,
        duplicated_template_id: token.duplicated_template_id,
      } as Prisma.InputJsonValue,
    });

    await this.eventLog.logEvent({
      clientId: payload.clientId,
      type: 'NOTION_OAUTH_CONNECTED',
      success: true,
    });

    return {
      ok: true,
      redirectTo: 'http://app.simplehiring.app/onboard/databases',
    };
  }

  private stateSecret(): string {
    return (
      this.config.get<string>('OAUTH_STATE_SECRET') ||
      this.config.getOrThrow<string>('TOKEN_ENC_KEY')
    );
  }

  private signState(payload: StatePayload): string {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = createHmac('sha256', this.stateSecret()).update(body).digest('base64url');
    return `${body}.${sig}`;
  }

  private verifyState(state: string): StatePayload {
    const [body, sig] = state.split('.');
    if (!body || !sig) throw new UnauthorizedException('Invalid state format');

    const expected = createHmac('sha256', this.stateSecret()).update(body).digest('base64url');
    const ok = timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!ok) throw new UnauthorizedException('Invalid state signature');

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as StatePayload;
    const ageMs = Date.now() - payload.issuedAt;
    if (ageMs > 10 * 60 * 1000) throw new UnauthorizedException('State expired');
    return payload;
  }
}
