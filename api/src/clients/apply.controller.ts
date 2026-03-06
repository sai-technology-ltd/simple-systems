import { BadRequestException, Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { ClientService } from '../client.service';
import { HiringIntakeService } from '../webhooks/hiring-intake.service';
import { NotionService } from '../notion/notion.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';

@Controller('apply')
export class ApplyController {
  constructor(
    private readonly clients: ClientService,
    private readonly notion: NotionService,
    private readonly intake: HiringIntakeService,
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

  @Post(':clientSlug/:roleSlug')
  async submit(
    @Param('clientSlug') clientSlug: string,
    @Param('roleSlug') roleSlug: string,
    @Body() dto: SubmitApplicationDto,
  ) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client || !client.notionDbRolesId) throw new BadRequestException('Client not configured');
    if (client.paymentStatus !== PaymentStatus.PAID) {
      throw new BadRequestException('This workspace is not active yet. Complete payment to accept applications.');
    }

    const result = await this.notion.findRoleBySlug(clientSlug, client.notionDbRolesId, roleSlug);
    const role = result.results?.[0];
    if (!role) throw new BadRequestException('Role not found');

    return this.intake.process(clientSlug, {
      roleId: role.id,
      candidateName: dto.name,
      candidateEmail: dto.email,
      phone: dto.phone,
      cvUrl: dto.cvUrl,
      notes: dto.notes,
      submissionId: `public_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    });
  }
}
