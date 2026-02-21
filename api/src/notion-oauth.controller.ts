import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { NotionOauthService } from './notion-oauth.service';

@Controller('notion/oauth')
export class NotionOauthController {
  constructor(private readonly oauth: NotionOauthService) {}

  @Get('start')
  @Redirect()
  async start(
    @Query('clientSlug') clientSlug: string,
    @Query('product') product?: string,
  ) {
    const { url } = await this.oauth.getStartUrl(clientSlug, product);
    return { url };
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string) {
    return this.oauth.handleCallback(code, state);
  }
}
