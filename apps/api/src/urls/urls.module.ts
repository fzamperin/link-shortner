import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UsersModule } from 'src/users/users.module';
import { Analytics } from './entities/analytics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Analytics]), UsersModule],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService, TypeOrmModule],
})
export class UrlsModule {}
