import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Url } from './url.entity';

@Entity({ name: 'analytics' })
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Url, (url) => url.analytics)
  url: Url;
}
