import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ClientService } from '../client.service';
import { NotionService } from '../notion/notion.service';

@Controller('apply')
export class ApplyController {
  constructor(
    private readonly clients: ClientService,
    private readonly notion: NotionService,
  ) {}

  @Get(':clientSlug/:roleSlug')
  async resolve(
    @Param('clientSlug') clientSlug: string,
    @Param('roleSlug') roleSlug: string,
  ) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client || !client.notionDbRolesId) throw new BadRequestException('Client not configured');

    const result = await this.notion.findRoleBySlug(clientSlug, client.notionDbRolesId, roleSlug);
    const role = result.results?.[0];
    if (!role) throw new BadRequestException('Role not found');

    return {
      clientSlug,
      roleSlug,
      rolePageId: role.id,
      roleName:
        role.properties?.['Role Name']?.title?.[0]?.plain_text ||
        role.properties?.Name?.title?.[0]?.plain_text ||
        null,
    };
  }
}
