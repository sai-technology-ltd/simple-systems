import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { ClientService } from '../client.service';
import { EventLogService } from '../event-log.service';
import { NotionService } from '../notion/notion.service';
import { SchemaValidatorService } from '../notion/schema-validator.service';
import { SelectDatabasesDto } from './dto/select-databases.dto';

@Controller('clients/:clientSlug/notion')
export class ClientsController {
  constructor(
    private readonly clients: ClientService,
    private readonly notion: NotionService,
    private readonly validator: SchemaValidatorService,
    private readonly events: EventLogService,
  ) {}

  @Get('databases')
  async list(@Param('clientSlug') clientSlug: string) {
    return this.notion.listDatabases(clientSlug);
  }

  @Post('databases/select')
  async select(@Param('clientSlug') clientSlug: string, @Body() dto: SelectDatabasesDto) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const [candidates, roles, stages] = await Promise.all([
      this.notion.getDatabase(clientSlug, dto.candidatesDbId),
      this.notion.getDatabase(clientSlug, dto.rolesDbId),
      this.notion.getDatabase(clientSlug, dto.stagesDbId),
    ]);

    const result = this.validator.validate({ candidates, roles, stages });

    await this.clients.updateSelectedDatabases(client.id, {
      candidatesDbId: dto.candidatesDbId,
      rolesDbId: dto.rolesDbId,
      stagesDbId: dto.stagesDbId,
    });

    await this.events.logEvent({
      clientId: client.id,
      type: 'NOTION_DATABASES_SELECTED',
      success: result.valid,
      meta: result,
      message: result.valid ? 'Database selection validated' : 'Schema validation failed',
    });

    return result;
  }
}
