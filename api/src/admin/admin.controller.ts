import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ClientService } from '../client.service';
import { EventLogService } from '../event-log.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly config: ConfigService,
    private readonly clients: ClientService,
    private readonly events: EventLogService,
  ) {}

  private assertAdmin(adminKey?: string) {
    const expected = this.config.getOrThrow<string>('ADMIN_API_KEY');
    if (!adminKey || adminKey !== expected) {
      throw new UnauthorizedException('Invalid admin key');
    }
  }

  @Post('clients')
  async createClient(@Headers('x-admin-key') key: string, @Body() dto: CreateClientDto) {
    this.assertAdmin(key);
    return this.clients.createClient(dto);
  }

  @Get('clients')
  async listClients(@Headers('x-admin-key') key: string) {
    this.assertAdmin(key);
    return this.clients.listClients();
  }

  @Get('clients/:clientSlug')
  async getClient(@Headers('x-admin-key') key: string, @Param('clientSlug') clientSlug: string) {
    this.assertAdmin(key);
    return this.clients.getBySlug(clientSlug);
  }

  @Post('clients/:clientSlug/suspend')
  async suspend(@Headers('x-admin-key') key: string, @Param('clientSlug') clientSlug: string) {
    this.assertAdmin(key);
    return this.clients.setStatus(clientSlug, ClientStatus.SUSPENDED);
  }

  @Post('clients/:clientSlug/activate')
  async activate(@Headers('x-admin-key') key: string, @Param('clientSlug') clientSlug: string) {
    this.assertAdmin(key);
    return this.clients.setStatus(clientSlug, ClientStatus.ACTIVE);
  }

  @Post('clients/:clientSlug/rotate-webhook-secret')
  async rotateSecret(@Headers('x-admin-key') key: string, @Param('clientSlug') clientSlug: string) {
    this.assertAdmin(key);
    return this.clients.rotateWebhookSecret(clientSlug);
  }

  @Get('clients/:clientSlug/logs')
  async logs(@Headers('x-admin-key') key: string, @Param('clientSlug') clientSlug: string) {
    this.assertAdmin(key);
    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');
    return this.events.listClientLogs(client.id);
  }
}
