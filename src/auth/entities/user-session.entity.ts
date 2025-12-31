import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'USER_SESSIONS' })
export class UserSession {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.useSessions)
  @JoinColumn({
    name: 'USER_ID',
    foreignKeyConstraintName: 'fk_user_user_session',
  })
  user: User;

  @Column({ unique: true, name: 'REFRESH_TOKEN_ID' })
  refreshTokenId: string;

  @Column({ name: 'IP', nullable: true })
  ip: string;

  @Column({ name: 'USERAGENT', nullable: true })
  userAgent: string;

  @Column({ nullable: true, name: 'DEVICE_TYPE' })
  deviceType: string;

  @Column({ nullable: true, name: 'DEVICE_BRAND' })
  deviceBrand: string;

  @Column({ nullable: true, name: 'DEVICE_MODEL' })
  deviceModel: string;

  @Column({ nullable: true, name: 'OS' })
  os: string;

  @Column({ nullable: true, name: 'BROWSER' })
  browser: string;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: true, name: 'LAST_ACTIVITY_AT', type: 'timestamp' })
  lastActivityAt?: Date;

  @Column({ nullable: true, name: 'REVOKED_AT', type: 'timestamp' })
  revokedAt?: Date;

  @Column({ name: 'EXPIRES_AT', type: 'timestamp' })
  expiresAt?: Date;
}
