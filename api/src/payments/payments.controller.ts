import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('clients/:clientSlug/payments/initialize')
  async initialize(
    @Param('clientSlug') clientSlug: string,
    @Body() dto: InitializePaymentDto,
  ) {
    return this.payments.initialize(clientSlug, dto);
  }

  @Get('clients/:clientSlug/payments/verify')
  async verify(
    @Param('clientSlug') clientSlug: string,
    @Query('reference') reference: string,
  ) {
    if (!reference) throw new BadRequestException('reference is required');
    return this.payments.verify(clientSlug, reference);
  }

  @Post('payments/lemonsqueezy/webhook')
  async lemonSqueezyWebhook(
    @Headers('x-signature') signature: string | undefined,
    @Headers('x-event-name') eventName: string | undefined,
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: unknown,
  ) {
    if (!signature)
      throw new UnauthorizedException('Missing Lemon Squeezy signature');
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(body);
    return this.payments.handleLemonSqueezyWebhook(
      rawBody,
      signature,
      eventName,
    );
  }

  @Post('payments/paddle/webhook')
  async paddleWebhook(
    @Headers('paddle-signature') signature: string | undefined,
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: unknown,
  ) {
    if (!signature) throw new UnauthorizedException('Missing Paddle signature');
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(body);
    return this.payments.handlePaddleWebhook(rawBody, signature);
  }

  @Post('payments/paystack/webhook')
  async paystackWebhook(
    @Headers('x-paystack-signature') signature: string | undefined,
    @Req() req: Request & { rawBody?: Buffer },
    @Body() body: unknown,
  ) {
    if (!signature)
      throw new UnauthorizedException('Missing Paystack signature');
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(body);
    return this.payments.handlePaystackWebhook(rawBody, signature);
  }
}
