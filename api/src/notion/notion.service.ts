import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientService } from '../client.service';
import { CryptoService } from '../crypto.service';
import { withRetry } from '../common/retry';

@Injectable()
export class NotionService {
  constructor(
    private readonly config: ConfigService,
    private readonly clients: ClientService,
    private readonly crypto: CryptoService,
  ) {}

  private async clientHeaders(clientSlug: string) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client || !client.notionAccessTokenEnc) {
      throw new BadGatewayException('Client Notion is not connected');
    }

    const token = this.crypto.decrypt(client.notionAccessTokenEnc);
    return {
      Authorization: `Bearer ${token}`,
      'Notion-Version': this.config.get<string>('NOTION_VERSION') || '2022-06-28',
      'Content-Type': 'application/json',
    };
  }

  async listDatabases(clientSlug: string) {
    const headers = await this.clientHeaders(clientSlug);

    const data = (await withRetry(async () => {
      const res = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filter: { value: 'database', property: 'object' },
          page_size: 100,
        }),
      });
      if (!res.ok) {
        const err: any = new Error(`Notion search failed: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return (await res.json()) as { results?: Array<{ id: string; title?: Array<{ plain_text: string }> }> };
    })) as { results?: Array<{ id: string; title?: Array<{ plain_text: string }> }> };

    return (data.results || []).map((db) => ({
      id: db.id,
      title: db.title?.map((x) => x.plain_text).join('') || '(untitled)',
    }));
  }

  async getDatabase(clientSlug: string, databaseId: string) {
    const headers = await this.clientHeaders(clientSlug);
    return withRetry(async () => {
      const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, { headers });
      if (!res.ok) {
        const err: any = new Error(`Notion get database failed: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
  }

  async queryDatabase(clientSlug: string, databaseId: string, body: object) {
    const headers = await this.clientHeaders(clientSlug);
    return withRetry(async () => {
      const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err: any = new Error(`Notion query failed: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
  }

  async createPage(clientSlug: string, databaseId: string, properties: Record<string, unknown>) {
    const headers = await this.clientHeaders(clientSlug);
    return withRetry(async () => {
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties,
        }),
      });
      if (!res.ok) {
        const err: any = new Error(`Notion create page failed: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
  }

  async findRoleBySlug(clientSlug: string, rolesDbId: string, roleSlug: string) {
    const headers = await this.clientHeaders(clientSlug);
    return withRetry(async () => {
      const res = await fetch(`https://api.notion.com/v1/databases/${rolesDbId}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filter: {
            property: 'Public Slug',
            rich_text: { equals: roleSlug },
          },
          page_size: 1,
        }),
      });
      if (!res.ok) {
        const err: any = new Error(`Notion role query failed: ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return (await res.json()) as { results?: Array<{ id: string; properties?: Record<string, any> }> };
    });
  }
}
