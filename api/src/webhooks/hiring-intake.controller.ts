import { Body, Controller, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { HiringIntakeDto } from './dto/hiring-intake.dto';
import { WebhookAuthService } from './webhook-auth.service';
import { HiringIntakeService } from './hiring-intake.service';

@Controller('webhooks/hiring')
export class HiringIntakeController {
  constructor(
    private readonly auth: WebhookAuthService,
    private readonly intakeService: HiringIntakeService,
  ) {}

  @Post('intake/:clientSlug')
  async intake(
    @Param('clientSlug') clientSlug: string,
    @Body() dto: HiringIntakeDto,
    @Headers('x-webhook-timestamp') timestamp?: string,
    @Headers('x-webhook-signature') signature?: string,
  ) {
    if (!timestamp || !signature) {
      throw new UnauthorizedException('Missing webhook signature headers');
    }

    const rawBody = JSON.stringify(dto);
    await this.auth.verify(clientSlug, rawBody, timestamp, signature);
    return this.intakeService.process(clientSlug, dto);
  }
}
