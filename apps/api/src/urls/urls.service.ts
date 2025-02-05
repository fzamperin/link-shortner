import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Analytics } from './entities/analytics.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlsRepository: Repository<Url>,
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

  find(url: Partial<Url>) {
    return this.urlsRepository.findOne({ where: { ...url } });
  }

  create(url: string, userId: string, slug?: string) {
    return this.urlsRepository.save({
      slug: slug || nanoid(6),
      url,
      user: { id: userId },
    });
  }

  createAnalytics(urlId: string, analytics: Partial<Analytics>) {
    return this.analyticsRepository.save({
      url: { id: urlId },
      ...analytics,
    });
  }

  list(userId: string) {
    return this.urlsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  update(url: Url) {
    return this.urlsRepository.save(url);
  }
}
