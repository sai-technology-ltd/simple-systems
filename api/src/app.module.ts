import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env';
import { PrismaService } from './prisma.service';
import { HealthController } from './health.controller';
import { CryptoService } from './crypto.service';
import { ClientService } from './client.service';
import { EventLogService } from './event-log.service';
import { NotionOauthService } from './notion-oauth.service';
import { NotionOauthController } from './notion-oauth.controller';
import { NotionService } from './notion/notion.service';
import { SchemaValidatorService } from './notion/schema-validator.service';
import { ClientsController } from './clients/clients.controller';
import { ClientSettingsController } from './clients/client-settings.controller';
import { ApplyController } from './clients/apply.controller';
import { WebhookAuthService } from './webhooks/webhook-auth.service';
import { HiringIntakeService } from './webhooks/hiring-intake.service';
import { HiringIntakeController } from './webhooks/hiring-intake.controller';
import { EmailService } from './email/email.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.x-admin-key',
            'req.headers.x-webhook-signature',
            'req.body.candidateEmail',
            'req.body.candidateName',
            'req.body.phone',
            'req.body.cvUrl',
            'req.body.access_token',
            'response.body.access_token',
          ],
          censor: '[REDACTED]',
        },
        customProps: () => ({ service: 'simple-systems-api' }),
      },
    }),
  ],
  controllers: [
    AppController,
    HealthController,
    NotionOauthController,
    ClientsController,
    ClientSettingsController,
    ApplyController,
    HiringIntakeController,
    AdminController,
  ],
  providers: [
    AppService,
    PrismaService,
    CryptoService,
    ClientService,
    EventLogService,
    NotionOauthService,
    NotionService,
    SchemaValidatorService,
    WebhookAuthService,
    HiringIntakeService,
    EmailService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
