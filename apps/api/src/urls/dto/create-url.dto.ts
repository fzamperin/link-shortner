import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  @IsOptional()
  slug: string;
}
