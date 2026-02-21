import { BadRequestException, Body, Controller, Param, Patch } from '@nestjs/common';
import { ClientService } from '../client.service';
import { EventLogService } from '../event-log.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('clients/:clientSlug/settings')
export class ClientSettingsController {
  constructor(
    private readonly clients: ClientService,
    private readonly events: EventLogService,
  ) {}

  @Patch()
  async patchSettings(
    @Param('clientSlug') clientSlug: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const updated = await this.clients.updateSettings(clientSlug, dto);

    await this.events.logEvent({
      clientId: client.id,
      type: 'SETTINGS_UPDATED',
      success: true,
      meta: dto,
    });

    return updated;
  }
}
