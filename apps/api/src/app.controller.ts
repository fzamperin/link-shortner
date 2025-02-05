import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { UrlsService } from './urls/urls.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiSeeOtherResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller()
@ApiTags('redirect')
@ApiSeeOtherResponse({ description: 'Redirect to the URL' })
@ApiNotFoundResponse({ description: 'URL not found' })
export class AppController {
  constructor(private urlService: UrlsService) {}

  @Get(':slug')
  @HttpCode(HttpStatus.SEE_OTHER)
  @ApiOperation({
    summary: 'Redirects the user based on the url',
  })
  async redirect(
    @Param('slug') slug: string,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<void> {
    const url = await this.urlService.find({ slug });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlService.createAnalytics(url.id, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });

    res.code(303).redirect(url.url);
  }
}
