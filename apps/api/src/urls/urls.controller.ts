import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('urls')
@UseGuards(JwtAuthGuard)
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'The URL has been successfully created' })
  @ApiOperation({
    summary: 'Creates new url',
  })
  create(@Body() createUrlDto: CreateUrlDto, @Req() req: FastifyRequest) {
    return this.urlsService.create(
      createUrlDto.url,
      req.userId,
      createUrlDto.slug,
    );
  }

  @Get()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of URLs that the user created' })
  @ApiOperation({
    summary: 'List urls created by the user based on token',
  })
  list(@Req() req: FastifyRequest) {
    return this.urlsService.list(req.userId);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The URL has been successfully updated',
  })
  @ApiBadRequestResponse({ description: 'Slug already exist' })
  @ApiOperation({
    summary: 'Updates the slug of the URL',
  })
  async update(
    @Req() req: FastifyRequest,
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    const [urlToUpdate, isDuplicate] = await Promise.all([
      this.urlsService.find({ id }),
      this.urlsService.find({ slug: updateUrlDto.slug }),
    ]);

    if (!urlToUpdate) {
      throw new NotFoundException('URL not found');
    }

    if (isDuplicate) {
      throw new BadRequestException('Slug already exist');
    }

    urlToUpdate.slug = updateUrlDto.slug;

    return this.urlsService.update(urlToUpdate);
  }
}
