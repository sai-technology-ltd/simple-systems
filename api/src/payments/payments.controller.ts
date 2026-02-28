import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller('clients/:clientSlug/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('initialize')
  async initialize(
    @Param('clientSlug') clientSlug: string,
    @Body() dto: InitializePaymentDto,
  ) {
    return this.payments.initialize(clientSlug, dto);
  }

  @Get('verify')
  async verify(
    @Param('clientSlug') clientSlug: string,
    @Query('reference') reference: string,
  ) {
    if (!reference) throw new BadRequestException('reference is required');
    return this.payments.verify(clientSlug, reference);
  }
}
