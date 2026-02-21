import { Injectable } from '@nestjs/common';
import { ClientStatus, Prisma, ProductType } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from './prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveBySlug(clientSlug: string) {
    return this.prisma.client.findFirst({
      where: { clientSlug, status: ClientStatus.ACTIVE },
    });
  }

  async markNotionConnected(clientId: string, data: {
    notionWorkspaceId: string;
    notionBotId: string;
    notionAccessTokenEnc: string;
    notionTokenMeta: Prisma.InputJsonValue;
  }) {
    return this.prisma.client.update({
      where: { id: clientId },
      data,
    });
  }

  async updateSelectedDatabases(
    clientId: string,
    dto: { candidatesDbId: string; rolesDbId: string; stagesDbId: string },
  ) {
    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        notionDbCandidatesId: dto.candidatesDbId,
        notionDbRolesId: dto.rolesDbId,
        notionDbStagesId: dto.stagesDbId,
      },
    });
  }

  async createClient(input: {
    companyName: string;
    clientSlug: string;
    productType: ProductType;
  }) {
    return this.prisma.client.create({
      data: {
        companyName: input.companyName,
        clientSlug: input.clientSlug,
        productType: input.productType,
        webhookSecret: randomBytes(32).toString('hex'),
      },
    });
  }

  async listClients() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        clientSlug: true,
        productType: true,
        status: true,
        notionWorkspaceId: true,
        notionDbCandidatesId: true,
        notionDbRolesId: true,
        notionDbStagesId: true,
        emailEnabled: true,
        monthlyEmailQuota: true,
      },
    });
  }

  async getBySlug(clientSlug: string) {
    return this.prisma.client.findUnique({ where: { clientSlug } });
  }

  async updateSettings(
    clientSlug: string,
    dto: {
      companyName?: string;
      replyToEmail?: string;
      logoUrl?: string;
      emailEnabled?: boolean;
      monthlyEmailQuota?: number;
    },
  ) {
    return this.prisma.client.update({ where: { clientSlug }, data: dto });
  }

  async setStatus(clientSlug: string, status: ClientStatus) {
    return this.prisma.client.update({ where: { clientSlug }, data: { status } });
  }

  async rotateWebhookSecret(clientSlug: string) {
    return this.prisma.client.update({
      where: { clientSlug },
      data: { webhookSecret: randomBytes(32).toString('hex') },
      select: { clientSlug: true, webhookSecret: true },
    });
  }

  async canSendEmail(clientId: string) {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client) return { ok: false, reason: 'CLIENT_NOT_FOUND' };
    if (!client.emailEnabled) return { ok: false, reason: 'EMAIL_DISABLED' };

    const monthKey = new Date().toISOString().slice(0, 7);
    let count = client.emailsSentMonth;

    if (client.emailsSentMonthKey !== monthKey) {
      await this.prisma.client.update({
        where: { id: clientId },
        data: { emailsSentMonth: 0, emailsSentMonthKey: monthKey },
      });
      count = 0;
    }

    if (count >= client.monthlyEmailQuota) {
      return { ok: false, reason: 'QUOTA_EXCEEDED' };
    }

    return { ok: true, reason: 'OK' };
  }

  async incrementEmailCounter(clientId: string) {
    return this.prisma.client.update({
      where: { id: clientId },
      data: { emailsSentMonth: { increment: 1 } },
    });
  }
}

