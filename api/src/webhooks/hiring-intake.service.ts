import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientService } from '../client.service';
import { EmailService } from '../email/email.service';
import { EventLogService } from '../event-log.service';
import { NotionService } from '../notion/notion.service';
import { HiringIntakeDto } from './dto/hiring-intake.dto';

@Injectable()
export class HiringIntakeService {
  constructor(
    private readonly clients: ClientService,
    private readonly notion: NotionService,
    private readonly email: EmailService,
    private readonly events: EventLogService,
  ) {}

  async process(clientSlug: string, dto: HiringIntakeDto) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');
    if (!client.notionDbCandidatesId || !client.notionDbStagesId) {
      throw new BadRequestException('Client setup incomplete');
    }

    if (
      dto.submissionId &&
      (await this.events.seenSubmission(client.id, dto.submissionId))
    ) {
      return { ok: true, idempotent: true };
    }

    const stages = (await this.notion.queryDatabase(
      clientSlug,
      client.notionDbStagesId,
      {
        sorts: [{ property: 'Order', direction: 'ascending' }],
        page_size: 1,
      },
    )) as { results?: Array<{ id: string }> };

    const firstStage = stages.results?.[0]?.id;
    if (!firstStage)
      throw new BadRequestException('No stages found in Stages DB');

    const candidatesDb = (await this.notion.getDatabase(
      clientSlug,
      client.notionDbCandidatesId,
    )) as {
      properties?: Record<string, { type?: string }>;
    };

    await this.notion.createPage(clientSlug, client.notionDbCandidatesId, {
      ...this.buildCandidateProperties(
        candidatesDb.properties ?? {},
        dto,
        firstStage,
      ),
    });

    const quota = await this.clients.canSendEmail(client.id);
    if (quota.ok) {
      const sent = await this.email.sendApplicationReceived({
        to: dto.candidateEmail,
        companyName: client.companyName,
        replyToEmail: client.replyToEmail,
        candidateName: dto.candidateName,
      });
      if (sent.sent) await this.clients.incrementEmailCounter(client.id);
    }

    await this.events.logEvent({
      clientId: client.id,
      type: 'HIRING_INTAKE',
      success: true,
      meta: {
        roleId: dto.roleId,
        candidateEmail: dto.candidateEmail,
        submissionId: dto.submissionId,
        notes: dto.notes,
      },
    });

    return { ok: true };
  }

  private buildCandidateProperties(
    properties: Record<string, { type?: string }>,
    dto: HiringIntakeDto,
    firstStage: string,
  ) {
    const payload: Record<string, unknown> = {
      Name: { title: [{ text: { content: dto.candidateName } }] },
      Role: { relation: [{ id: dto.roleId }] },
      Stage: { relation: [{ id: firstStage }] },
    };

    this.assignTypedValue(payload, properties, 'Email', dto.candidateEmail);

    if (dto.phone) {
      this.assignTypedValue(payload, properties, 'Phone', dto.phone);
    }

    if (dto.cvUrl) {
      this.assignTypedValue(payload, properties, 'CV URL', dto.cvUrl);
    }

    if (dto.notes) {
      for (const field of [
        'Notes',
        'Additional Notes',
        'Cover Letter',
        'Candidate Notes',
      ]) {
        if (properties[field]) {
          this.assignTypedValue(payload, properties, field, dto.notes);
          break;
        }
      }
    }

    return payload;
  }

  private assignTypedValue(
    payload: Record<string, unknown>,
    properties: Record<string, { type?: string }>,
    propertyName: string,
    value: string,
  ) {
    const type = properties[propertyName]?.type;

    if (type === 'email') {
      payload[propertyName] = { email: value };
      return;
    }

    if (type === 'url') {
      payload[propertyName] = { url: value };
      return;
    }

    if (type === 'phone_number') {
      payload[propertyName] = { phone_number: value };
      return;
    }

    payload[propertyName] = { rich_text: [{ text: { content: value } }] };
  }
}
