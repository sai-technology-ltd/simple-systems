import { Body, Controller, Post } from '@nestjs/common';
import { ProductType } from '@prisma/client';
import { ClientService } from '../client.service';
import { StartOnboardingDto } from './dto/start-onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly clients: ClientService) {}

  @Post('start')
  async start(@Body() dto: StartOnboardingDto) {
    const client = await this.clients.createOnboardingClient({
      companyName: dto.companyName,
      replyToEmail: dto.replyToEmail,
      productType: ProductType.HIRING,
    });

    return {
      clientId: client.id,
      clientSlug: client.clientSlug,
      companyName: client.companyName,
      paymentStatus: client.paymentStatus,
    };
  }
}
