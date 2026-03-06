import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ClientWorkspaceController } from './client-workspace.controller';
import { ClientService } from '../client.service';
import { HiringIntakeService } from '../webhooks/hiring-intake.service';
import { NotionOauthService } from '../notion-oauth.service';
import { NotionService } from '../notion/notion.service';
import { SchemaValidatorService } from '../notion/schema-validator.service';
import { EventLogService } from '../event-log.service';

describe('ClientWorkspaceController', () => {
  let controller: ClientWorkspaceController;
  let clients: jest.Mocked<ClientService>;
  let config: jest.Mocked<ConfigService>;
  let intake: jest.Mocked<HiringIntakeService>;
  let notion: jest.Mocked<NotionService>;
  let oauth: jest.Mocked<NotionOauthService>;
  let validator: jest.Mocked<SchemaValidatorService>;
  let events: jest.Mocked<EventLogService>;

  beforeEach(() => {
    clients = {
      getBySlug: jest.fn(),
      findActiveBySlug: jest.fn(),
    } as unknown as jest.Mocked<ClientService>;
    config = {
      getOrThrow: jest.fn().mockReturnValue('https://api.simplesystem.app'),
    } as unknown as jest.Mocked<ConfigService>;
    intake = {
      process: jest.fn(),
    } as unknown as jest.Mocked<HiringIntakeService>;
    notion = {
      getDatabase: jest.fn(),
      queryDatabase: jest.fn(),
      findRoleBySlug: jest.fn(),
    } as unknown as jest.Mocked<NotionService>;
    oauth = {
      getStartUrl: jest.fn(),
    } as unknown as jest.Mocked<NotionOauthService>;
    validator = {
      validate: jest.fn(),
    } as unknown as jest.Mocked<SchemaValidatorService>;
    events = {
      hasSuccessfulEvent: jest.fn(),
      logEvent: jest.fn(),
    } as unknown as jest.Mocked<EventLogService>;

    controller = new ClientWorkspaceController(
      clients,
      config,
      intake,
      notion,
      oauth,
      validator,
      events,
    );
  });

  it('returns workspace summary for a configured client', async () => {
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      logoUrl: null,
      emailEnabled: true,
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PAID,
      emailsSentMonth: 10,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);
    notion.getDatabase.mockResolvedValue({ properties: {} } as never);
    validator.validate.mockReturnValue({
      valid: true,
      missing: [],
      fixes: [],
    });

    const result = await controller.getWorkspace('swift-transport');

    expect(result).toEqual(
      expect.objectContaining({
        clientSlug: 'swift-transport',
        paymentPaid: true,
        validationPassed: true,
        previewTestAvailable: false,
        previewTestUsed: false,
        settings: expect.objectContaining({
          companyName: 'Swift Transport',
          replyToEmail: 'hiring@swift.com',
        }),
        webhookUrl:
          'https://api.simplesystem.app/webhooks/hiring/intake/swift-transport',
      }),
    );
  });

  it('maps Notion role pages into frontend role summaries', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
    } as never);
    notion.queryDatabase.mockResolvedValue({
      results: [
        {
          id: 'role-1',
          properties: {
            'Role Name': { title: [{ plain_text: 'Backend Engineer' }] },
            'Public Slug': { rich_text: [{ plain_text: 'backend-engineer' }] },
            Status: { select: { name: 'Open' } },
            Description: { rich_text: [{ plain_text: 'Build APIs' }] },
          },
        },
      ],
    } as never);

    await expect(controller.listRoles('swift-transport')).resolves.toEqual([
      {
        id: 'role-1',
        name: 'Backend Engineer',
        slug: 'backend-engineer',
        status: 'Open',
        description: 'Build APIs',
        applicationUrl: 'https://simplehiring.app/apply/swift-transport/backend-engineer',
      },
    ]);
  });

  it('returns redirect mode when a role defines an external form URL', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      companyName: 'Swift Transport',
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({
      results: [
        {
          id: 'role-1',
          properties: {
            'Role Name': { title: [{ plain_text: 'Backend Engineer' }] },
            'Public Slug': { rich_text: [{ plain_text: 'backend-engineer' }] },
            'Application Form URL': { url: 'https://forms.example.com/apply' },
          },
        },
      ],
    } as never);
    notion.getDatabase.mockResolvedValue({ properties: {} } as never);
    validator.validate.mockReturnValue({
      valid: true,
      missing: [],
      fixes: [],
    });

    const result = await controller.getRole('swift-transport', 'backend-engineer');

    expect(result.formMode).toBe('redirect');
    expect(result.formUrl).toBe('https://forms.example.com/apply');
    expect(result.workspaceActive).toBe(true);
  });

  it('accepts external form URLs stored as rich text', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      companyName: 'Swift Transport',
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({
      results: [
        {
          id: 'role-1',
          properties: {
            'Role Name': { title: [{ plain_text: 'Backend Engineer' }] },
            'Public Slug': { rich_text: [{ plain_text: 'backend-engineer' }] },
            'Apply URL': {
              rich_text: [{ plain_text: 'https://forms.example.com/apply' }],
            },
          },
        },
      ],
    } as never);
    notion.getDatabase.mockResolvedValue({ properties: {} } as never);
    validator.validate.mockReturnValue({
      valid: true,
      missing: [],
      fixes: [],
    });

    const result = await controller.getRole('swift-transport', 'backend-engineer');

    expect(result.formMode).toBe('redirect');
    expect(result.formUrl).toBe('https://forms.example.com/apply');
  });

  it('returns validation issues in frontend format', async () => {
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      emailEnabled: true,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);
    notion.getDatabase.mockResolvedValue({ properties: {} } as never);
    validator.validate.mockReturnValue({
      valid: false,
      missing: [
        {
          database: 'roles',
          property: 'Public Slug',
          recommendedType: 'rich_text',
        },
      ],
      fixes: ['Add Public Slug'],
    });

    await expect(controller.validate('swift-transport')).resolves.toEqual({
      ok: false,
      message: 'Your Notion databases need a few fixes before the workspace can go live.',
      issues: [
        {
          database: 'roles',
          message: 'Add "Public Slug" as a rich_text field.',
        },
      ],
    });
  });

  it('returns a workspace issue when Notion is not connected', async () => {
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: null,
      notionDbCandidatesId: null,
      notionDbRolesId: null,
      notionDbStagesId: null,
      paymentStatus: PaymentStatus.PENDING,
      companyName: 'Swift Transport',
      replyToEmail: '',
      logoUrl: null,
      emailEnabled: true,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);

    await expect(controller.getWorkspace('swift-transport')).resolves.toEqual(
      expect.objectContaining({
        notionConnected: false,
        validationPassed: false,
        validationMessage: 'Connect your Notion workspace to continue.',
      }),
    );
  });

  it('returns a workspace issue when databases are missing', async () => {
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: null,
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
      companyName: 'Swift Transport',
      replyToEmail: '',
      logoUrl: null,
      emailEnabled: true,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);

    await expect(controller.validate('swift-transport')).resolves.toEqual({
      ok: false,
      message: 'Select your Candidates, Roles, and Stages databases.',
      issues: [
        {
          database: 'workspace',
          message: 'Roles database has not been selected.',
        },
      ],
    });
  });

  it('marks the workspace inactive when payment has failed', async () => {
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: null,
      notionDbCandidatesId: null,
      notionDbRolesId: null,
      notionDbStagesId: null,
      paymentStatus: PaymentStatus.FAILED,
      companyName: 'Swift Transport',
      replyToEmail: '',
      logoUrl: null,
      emailEnabled: true,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);

    await expect(controller.getWorkspace('swift-transport')).resolves.toEqual(
      expect.objectContaining({
        status: 'inactive',
      }),
    );
  });

  it('returns a generic validation error when Notion validation fails in workspace view', async () => {
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      logoUrl: null,
      emailEnabled: true,
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);
    notion.getDatabase.mockRejectedValue(new Error('Notion unavailable'));

    await expect(controller.getWorkspace('swift-transport')).resolves.toEqual(
      expect.objectContaining({
        validationPassed: false,
        validationMessage: 'We could not validate your Notion setup right now.',
      }),
    );
  });

  it('returns a descriptive error when explicit validation cannot complete', async () => {
    clients.getBySlug.mockResolvedValue({
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      logoUrl: null,
      emailEnabled: true,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    notion.getDatabase.mockRejectedValue(new Error('Notion unavailable'));

    await expect(controller.validate('swift-transport')).resolves.toEqual({
      ok: false,
      message: 'Unable to validate the selected databases.',
      issues: [
        {
          database: 'workspace',
          message: 'Validation could not complete: Notion unavailable',
        },
      ],
    });
  });

  it('returns a permission-specific error when Notion denies access during validation', async () => {
    clients.getBySlug.mockResolvedValue({
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
      companyName: 'Swift Transport',
      replyToEmail: 'hiring@swift.com',
      logoUrl: null,
      emailEnabled: true,
      emailsSentMonth: 0,
      monthlyEmailQuota: 500,
      updatedAt: new Date('2026-03-06T00:00:00.000Z'),
    } as never);
    notion.getDatabase.mockRejectedValue({ status: 403, message: 'Forbidden' });

    await expect(controller.validate('swift-transport')).resolves.toEqual({
      ok: false,
      message: 'Unable to validate the selected databases.',
      issues: [
        {
          database: 'workspace',
          message:
            'Notion denied access to one of the selected databases. Reconnect the integration and confirm every database is shared with it.',
        },
      ],
    });
  });

  it('starts Notion OAuth via the backend route the frontend calls', async () => {
    oauth.getStartUrl.mockResolvedValue({
      url: 'https://api.notion.com/v1/oauth/authorize?state=abc',
    } as never);

    await expect(controller.connectNotion('swift-transport')).resolves.toEqual({
      authorizationUrl: 'https://api.notion.com/v1/oauth/authorize?state=abc',
    });
  });

  it('sends a backend-driven test submission', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      notionDbRolesId: 'roles-db',
      replyToEmail: 'hiring@swift.com',
      paymentStatus: PaymentStatus.PENDING,
    } as never);
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      clientSlug: 'swift-transport',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(false);
    notion.getDatabase.mockResolvedValue({ properties: {} } as never);
    validator.validate.mockReturnValue({
      valid: true,
      missing: [],
      fixes: [],
    });
    notion.queryDatabase.mockResolvedValue({
      results: [
        {
          id: 'role-1',
          properties: {
            'Role Name': { title: [{ plain_text: 'Backend Engineer' }] },
          },
        },
      ],
    } as never);
    intake.process.mockResolvedValue({ ok: true } as never);

    const result = await controller.testSubmission('swift-transport');

    expect(intake.process).toHaveBeenCalledWith(
      'swift-transport',
      expect.objectContaining({
        roleId: 'role-1',
        candidateEmail: 'hiring@swift.com',
      }),
    );
    expect(result).toEqual({
      ok: true,
      message: 'Test application sent for Backend Engineer.',
    });
    expect(events.logEvent).toHaveBeenCalledWith({
      clientId: 'client-1',
      type: 'HIRING_PREVIEW_TEST',
      success: true,
      meta: { roleId: 'role-1' },
    });
  });

  it('rejects test submission after the free preview is used', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      notionDbRolesId: 'roles-db',
      replyToEmail: 'hiring@swift.com',
      paymentStatus: PaymentStatus.PENDING,
    } as never);
    clients.getBySlug.mockResolvedValue({
      id: 'client-1',
      notionAccessTokenEnc: 'encrypted',
      notionDbCandidatesId: 'candidates-db',
      notionDbRolesId: 'roles-db',
      notionDbStagesId: 'stages-db',
      paymentStatus: PaymentStatus.PENDING,
    } as never);
    events.hasSuccessfulEvent.mockResolvedValue(true);
    notion.getDatabase.mockResolvedValue({ properties: {} } as never);
    validator.validate.mockReturnValue({
      valid: true,
      missing: [],
      fixes: [],
    });

    await expect(controller.testSubmission('swift-transport')).rejects.toThrow(
      'Your free preview test is already used. Complete payment to keep sending test applications.',
    );
  });

  it('rejects test submission when no roles exist', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      replyToEmail: 'hiring@swift.com',
      paymentStatus: PaymentStatus.PENDING,
    } as never);
    notion.queryDatabase.mockResolvedValue({
      results: [],
    } as never);

    await expect(controller.testSubmission('swift-transport')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects test submission when no reply-to email is configured', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      replyToEmail: null,
      paymentStatus: PaymentStatus.PENDING,
    } as never);

    await expect(controller.testSubmission('swift-transport')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when listing roles for a missing client', async () => {
    clients.findActiveBySlug.mockResolvedValue(null as never);

    await expect(controller.listRoles('swift-transport')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
