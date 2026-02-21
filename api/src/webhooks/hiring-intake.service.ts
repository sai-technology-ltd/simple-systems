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

    if (dto.submissionId && (await this.events.seenSubmission(client.id, dto.submissionId))) {
      return { ok: true, idempotent: true };
    }

    const stages = (await this.notion.queryDatabase(clientSlug, client.notionDbStagesId, {
      sorts: [{ property: 'Order', direction: 'ascending' }],
      page_size: 1,
    })) as { results?: Array<{ id: string }> };

    const firstStage = stages.results?.[0]?.id;
    if (!firstStage) throw new BadRequestException('No stages found in Stages DB');

    await this.notion.createPage(clientSlug, client.notionDbCandidatesId, {
      Name: { title: [{ text: { content: dto.candidateName } }] },
      Email: { email: dto.candidateEmail },
      Phone: dto.phone ? { rich_text: [{ text: { content: dto.phone } }] } : undefined,
      'CV URL': dto.cvUrl ? { url: dto.cvUrl } : undefined,
      Role: { relation: [{ id: dto.roleId }] },
      Stage: { relation: [{ id: firstStage }] },
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
      },
    });

    return { ok: true };
  }
}
