import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventLogService {
  constructor(private readonly prisma: PrismaService) {}

  async logEvent(input: {
    clientId: string;
    type: string;
    success: boolean;
    message?: string;
    meta?: object;
  }) {
    return this.prisma.eventLog.create({
      data: {
        clientId: input.clientId,
        type: input.type,
        success: input.success,
        message: input.message,
        meta: input.meta,
      },
    });
  }

  async seenSubmission(clientId: string, submissionId: string) {
    const rows = await this.prisma.eventLog.findMany({
      where: {
        clientId,
        type: 'HIRING_INTAKE',
        meta: {
          path: ['submissionId'],
          equals: submissionId,
        },
      },
      take: 1,
      orderBy: { createdAt: 'desc' },
    });
    return rows.length > 0;
  }

  async listClientLogs(clientId: string, take = 50) {
    return this.prisma.eventLog.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
