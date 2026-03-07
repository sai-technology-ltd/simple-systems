import { BadRequestException } from '@nestjs/common';
import { HiringIntakeService } from './hiring-intake.service';
import { ClientService } from '../client.service';
import { NotionService } from '../notion/notion.service';
import { EmailService } from '../email/email.service';
import { EventLogService } from '../event-log.service';

describe('HiringIntakeService', () => {
  let service: HiringIntakeService;
  let clients: jest.Mocked<ClientService>;
  let notion: jest.Mocked<NotionService>;
  let email: jest.Mocked<EmailService>;
  let events: jest.Mocked<EventLogService>;

  beforeEach(() => {
    clients = {
      findActiveBySlug: jest.fn(),
      canSendEmail: jest.fn(),
      incrementEmailCounter: jest.fn(),
    } as unknown as jest.Mocked<ClientService>;
    notion = {
      queryDatabase: jest.fn(),
      getDatabase: jest.fn(),
      createPage: jest.fn(),
    } as unknown as jest.Mocked<NotionService>;
    email = {
      sendApplicationReceived: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;
    events = {
      seenSubmission: jest.fn(),
      logEvent: jest.fn(),
    } as unknown as jest.Mocked<EventLogService>;

    service = new HiringIntakeService(clients, notion, email, events);
  });

  it('creates a candidate using schema-aware Notion property types', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      notionDbCandidatesId: 'candidates-db',
      notionDbStagesId: 'stages-db',
    } as never);
    events.seenSubmission.mockResolvedValue(false);
    notion.queryDatabase.mockResolvedValue({
      results: [{ id: 'stage-1' }],
    } as never);
    notion.getDatabase.mockResolvedValue({
      properties: {
        Email: { type: 'email' },
        Phone: { type: 'phone_number' },
        'CV URL': { type: 'url' },
        Notes: { type: 'rich_text' },
      },
    } as never);
    notion.createPage.mockResolvedValue({ id: 'page-1' } as never);
    clients.canSendEmail.mockResolvedValue({ ok: true, reason: 'OK' } as never);
    email.sendApplicationReceived.mockResolvedValue({ sent: true } as never);

    await expect(
      service.process('swift-transport', {
        roleId: 'role-1',
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
        phone: '+15550000000',
        cvUrl: 'https://example.com/cv.pdf',
        notes: 'Strong infra background.',
        submissionId: 'submission-1',
      }),
    ).resolves.toEqual({ ok: true });

    expect(notion.createPage).toHaveBeenCalledWith(
      'swift-transport',
      'candidates-db',
      expect.objectContaining({
        Name: { title: [{ text: { content: 'Jane Doe' } }] },
        Email: { email: 'jane@example.com' },
        Phone: { phone_number: '+15550000000' },
        'CV URL': { url: 'https://example.com/cv.pdf' },
        Notes: {
          rich_text: [{ text: { content: 'Strong infra background.' } }],
        },
        Role: { relation: [{ id: 'role-1' }] },
        Stage: { relation: [{ id: 'stage-1' }] },
      }),
    );
    expect(email.sendApplicationReceived).toHaveBeenCalled();
    expect(clients.incrementEmailCounter).toHaveBeenCalledWith('client-1');
    expect(events.logEvent).toHaveBeenCalled();
  });

  it('returns idempotent true for duplicate submissions', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      notionDbCandidatesId: 'candidates-db',
      notionDbStagesId: 'stages-db',
    } as never);
    events.seenSubmission.mockResolvedValue(true);

    await expect(
      service.process('swift-transport', {
        roleId: 'role-1',
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
        submissionId: 'duplicate-1',
      }),
    ).resolves.toEqual({ ok: true, idempotent: true });

    expect(notion.createPage).not.toHaveBeenCalled();
  });

  it('throws when client setup is incomplete', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      notionDbCandidatesId: null,
      notionDbStagesId: null,
    } as never);

    await expect(
      service.process('swift-transport', {
        roleId: 'role-1',
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('skips email delivery when quota is exhausted', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      notionDbCandidatesId: 'candidates-db',
      notionDbStagesId: 'stages-db',
    } as never);
    events.seenSubmission.mockResolvedValue(false);
    notion.queryDatabase.mockResolvedValue({
      results: [{ id: 'stage-1' }],
    } as never);
    notion.getDatabase.mockResolvedValue({
      properties: {
        Email: { type: 'rich_text' },
      },
    } as never);
    clients.canSendEmail.mockResolvedValue({
      ok: false,
      reason: 'QUOTA_EXCEEDED',
    } as never);

    await expect(
      service.process('swift-transport', {
        roleId: 'role-1',
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
      }),
    ).resolves.toEqual({ ok: true });

    expect(email.sendApplicationReceived).not.toHaveBeenCalled();
    expect(clients.incrementEmailCounter).not.toHaveBeenCalled();
  });
});
