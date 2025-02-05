import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Analytics } from './analytics.entity';

@Entity({ name: 'urls' })
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ nullable: false })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0, type: 'int' })
  numberOfVisits: number;

  @ManyToOne(() => User, (user) => user.urls)
  user: User;

  @OneToMany(() => Analytics, (analytics) => analytics.url)
  analytics: Analytics;
}
