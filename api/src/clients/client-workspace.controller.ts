import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { ClientService } from '../client.service';
import { ConfigService } from '@nestjs/config';
import { HiringIntakeService } from '../webhooks/hiring-intake.service';
import { NotionOauthService } from '../notion-oauth.service';
import { NotionService } from '../notion/notion.service';
import { SchemaValidatorService } from '../notion/schema-validator.service';

type NotionProperty = {
  type?: string;
  title?: Array<{ plain_text?: string }>;
  rich_text?: Array<{ plain_text?: string }>;
  select?: { name?: string | null };
  url?: string | null;
  checkbox?: boolean | null;
};

type NotionPage = {
  id: string;
  properties?: Record<string, NotionProperty>;
};

type ValidationIssue = {
  database: 'candidates' | 'roles' | 'stages' | 'workspace';
  message: string;
};

type WorkspaceValidationResult = {
  ok: boolean;
  message: string;
  issues: ValidationIssue[];
};

@Controller('clients/:clientSlug')
export class ClientWorkspaceController {
  constructor(
    private readonly clients: ClientService,
    private readonly config: ConfigService,
    private readonly intake: HiringIntakeService,
    private readonly notion: NotionService,
    private readonly oauth: NotionOauthService,
    private readonly validator: SchemaValidatorService,
  ) {}

  @Get()
  async getWorkspace(@Param('clientSlug') clientSlug: string) {
    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    const validation = await this.validateWorkspace(clientSlug, true);

    return {
      clientSlug: client.clientSlug,
      status: this.workspaceStatus(client.paymentStatus, validation.ok),
      activatedAt: client.paymentStatus === PaymentStatus.PAID ? client.updatedAt.toISOString() : null,
      settings: {
        companyName: client.companyName,
        replyToEmail: client.replyToEmail ?? '',
        logoUrl: client.logoUrl,
        emailEnabled: client.emailEnabled,
      },
      notionConnected: Boolean(client.notionAccessTokenEnc),
      paymentPaid: client.paymentStatus === PaymentStatus.PAID,
      paymentPending: client.paymentStatus === PaymentStatus.PENDING,
      databasesSaved: Boolean(
        client.notionDbCandidatesId && client.notionDbRolesId && client.notionDbStagesId,
      ),
      selectedDatabases: {
        candidatesDatabaseId: client.notionDbCandidatesId ?? '',
        rolesDatabaseId: client.notionDbRolesId ?? '',
        stagesDatabaseId: client.notionDbStagesId ?? '',
      },
      validationPassed: validation.ok,
      validationMessage: validation.message,
      webhookUrl: `${this.config.getOrThrow<string>('BASE_URL')}/webhooks/hiring/intake/${client.clientSlug}`,
      setupGuideUrl: null,
      emailsSentThisMonth: client.emailsSentMonth,
      monthlyEmailQuota: client.monthlyEmailQuota,
      emailQuotaExceeded: client.emailsSentMonth >= client.monthlyEmailQuota,
    };
  }

  @Get('roles')
  async listRoles(@Param('clientSlug') clientSlug: string) {
    const client = await this.requireClientWithRoles(clientSlug);
    const roles = await this.notion.queryDatabase(clientSlug, client.notionDbRolesId!, {
      page_size: 100,
    });

    return ((roles as { results?: NotionPage[] }).results ?? [])
      .map((role) => this.mapRoleSummary(clientSlug, role))
      .filter((role) => Boolean(role.slug));
  }

  @Get('roles/:roleSlug')
  async getRole(
    @Param('clientSlug') clientSlug: string,
    @Param('roleSlug') roleSlug: string,
  ) {
    const client = await this.requireClientWithRoles(clientSlug);
    const result = await this.notion.findRoleBySlug(clientSlug, client.notionDbRolesId!, roleSlug);
    const role = result.results?.[0] as NotionPage | undefined;
    if (!role) throw new BadRequestException('Role not found');

    const validation = await this.validateWorkspace(clientSlug, true);
    const externalFormUrl = this.findFirstUrl(role.properties, [
      'Application Form URL',
      'External Application URL',
      'Form URL',
      'Apply URL',
    ]);

    return {
      ...this.mapRoleSummary(clientSlug, role),
      clientSlug,
      companyName: client.companyName,
      workspaceActive: client.paymentStatus === PaymentStatus.PAID && validation.ok,
      formUrl: externalFormUrl,
      formMode: externalFormUrl ? 'redirect' : 'native',
    };
  }

  @Post('validate')
  async validate(@Param('clientSlug') clientSlug: string) {
    return this.validateWorkspace(clientSlug, false);
  }

  @Post('test-submission')
  async testSubmission(@Param('clientSlug') clientSlug: string) {
    const client = await this.requireClientWithRoles(clientSlug);
    if (!client.replyToEmail) {
      throw new BadRequestException('Add a reply-to email before sending a test application');
    }

    const roles = await this.notion.queryDatabase(clientSlug, client.notionDbRolesId!, {
      page_size: 1,
    });
    const role = (roles as { results?: NotionPage[] }).results?.[0];
    if (!role) throw new BadRequestException('No roles found');

    await this.intake.process(clientSlug, {
      roleId: role.id,
      candidateName: 'Test Candidate',
      candidateEmail: client.replyToEmail,
      phone: '+10000000000',
      submissionId: `test_${Date.now()}`,
      notes: 'Test submission triggered from the workspace dashboard.',
    });

    const roleName = this.getPlainText(role.properties, ['Role Name', 'Name']) || 'your first role';

    return {
      ok: true,
      message: `Test application sent for ${roleName}.`,
    };
  }

  @Post('notion/connect')
  async connectNotion(@Param('clientSlug') clientSlug: string) {
    const { url } = await this.oauth.getStartUrl(clientSlug, 'HIRING');
    return { authorizationUrl: url };
  }

  private async validateWorkspace(clientSlug: string, silent: boolean) {
    const client = await this.clients.getBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');

    if (!client.notionAccessTokenEnc) {
      return {
        ok: false,
        message: 'Connect your Notion workspace to continue.',
        issues: [
          {
            database: 'workspace',
            message: 'Notion is not connected.',
          } satisfies ValidationIssue,
        ],
      };
    }

    const missingSelections = this.missingDatabaseSelections(client);
    if (missingSelections.length > 0) {
      return {
        ok: false,
        message: 'Select your Candidates, Roles, and Stages databases.',
        issues: missingSelections.map((database) => ({
          database: 'workspace',
          message: `${database} database has not been selected.`,
        })) satisfies ValidationIssue[],
      };
    }

    const candidatesDbId = client.notionDbCandidatesId as string;
    const rolesDbId = client.notionDbRolesId as string;
    const stagesDbId = client.notionDbStagesId as string;

    try {
      const [candidates, roles, stages] = await Promise.all([
        this.notion.getDatabase(clientSlug, candidatesDbId),
        this.notion.getDatabase(clientSlug, rolesDbId),
        this.notion.getDatabase(clientSlug, stagesDbId),
      ]);

      const result = this.validator.validate({ candidates, roles, stages });
      const issues = result.missing.map((issue) => ({
        database: issue.database,
        message: `Add "${issue.property}" as a ${issue.recommendedType} field.`,
      })) satisfies ValidationIssue[];

      return {
        ok: result.valid,
        message: result.valid
          ? 'Your workspace is ready. You can activate it whenever you’re ready.'
          : 'Your Notion databases need a few fixes before the workspace can go live.',
        issues,
      };
    } catch (error) {
      return this.handleValidationFailure(error, silent);
    }
  }

  private missingDatabaseSelections(client: {
    notionDbCandidatesId?: string | null;
    notionDbRolesId?: string | null;
    notionDbStagesId?: string | null;
  }) {
    const missing: string[] = [];
    if (!client.notionDbCandidatesId) missing.push('Candidates');
    if (!client.notionDbRolesId) missing.push('Roles');
    if (!client.notionDbStagesId) missing.push('Stages');
    return missing;
  }

  private handleValidationFailure(error: unknown, silent: boolean): WorkspaceValidationResult {
    const detail = this.describeValidationError(error);
    return {
      ok: false,
      message: silent
        ? 'We could not validate your Notion setup right now.'
        : 'Unable to validate the selected databases.',
      issues: [
        {
          database: 'workspace',
          message: detail,
        },
      ],
    };
  }

  private describeValidationError(error: unknown) {
    const status = this.readErrorField<number>(error, 'status');
    const message = this.readErrorField<string>(error, 'message');

    if (status === 404) {
      return 'One of the selected databases could not be found in Notion. Re-select the database and try again.';
    }

    if (status === 401 || status === 403) {
      return 'Notion denied access to one of the selected databases. Reconnect the integration and confirm every database is shared with it.';
    }

    if (message) {
      return `Validation could not complete: ${message}`;
    }

    return 'Validation could not complete. Try again after reconnecting Notion.';
  }

  private readErrorField<T>(error: unknown, key: string): T | undefined {
    if (!error || typeof error !== 'object' || !(key in error)) return undefined;
    return (error as Record<string, T>)[key];
  }

  private async requireClientWithRoles(clientSlug: string) {
    const client = await this.clients.findActiveBySlug(clientSlug);
    if (!client) throw new BadRequestException('Client not found');
    if (!client.notionDbRolesId) throw new BadRequestException('Roles database not configured');
    return client;
  }

  private workspaceStatus(paymentStatus: PaymentStatus, validationPassed: boolean) {
    if (paymentStatus === PaymentStatus.PAID) return 'active';
    if (validationPassed) return 'setup_complete';
    if (paymentStatus === PaymentStatus.PENDING) return 'in_progress';
    return 'inactive';
  }

  private mapRoleSummary(clientSlug: string, role: NotionPage) {
    const slug = this.getPlainText(role.properties, ['Public Slug', 'Slug']);

    return {
      id: role.id,
      name: this.getPlainText(role.properties, ['Role Name', 'Name']) || 'Untitled role',
      slug: slug || '',
      description: this.getPlainText(role.properties, ['Description', 'Summary', 'Job Description']),
      status: this.getSelectName(role.properties, ['Status']),
      applicationUrl: slug ? `https://simplehiring.app/apply/${clientSlug}/${slug}` : null,
    };
  }

  private getPlainText(
    properties: Record<string, NotionProperty> | undefined,
    names: string[],
  ) {
    for (const name of names) {
      const value = properties?.[name];
      if (!value) continue;
      if (value.title?.length) {
        const text = value.title.map((item) => item.plain_text ?? '').join('').trim();
        if (text) return text;
      }
      if (value.rich_text?.length) {
        const text = value.rich_text.map((item) => item.plain_text ?? '').join('').trim();
        if (text) return text;
      }
    }

    return null;
  }

  private getSelectName(
    properties: Record<string, NotionProperty> | undefined,
    names: string[],
  ) {
    for (const name of names) {
      const value = properties?.[name];
      if (value?.select?.name) return value.select.name;
    }

    return null;
  }

  private findFirstUrl(
    properties: Record<string, NotionProperty> | undefined,
    names: string[],
  ) {
    for (const name of names) {
      const value = properties?.[name];
      if (!value) continue;
      if (value.url) return value.url;
      if (value.rich_text?.length) {
        const text = value.rich_text.map((item) => item.plain_text ?? '').join('').trim();
        if (text.startsWith('http://') || text.startsWith('https://')) return text;
      }
    }

    return null;
  }
}
