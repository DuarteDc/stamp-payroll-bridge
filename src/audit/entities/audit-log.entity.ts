import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'AUDIT_LOG' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'IP' })
  ip: string;

  @Column({ name: 'USER_AGENT' })
  userAgent: string;

  @Column({ name: 'METHOD' })
  method: string;

  @Column({ name: 'PATH' })
  path: string;

  @Column({ name: 'BODY', type: 'simple-json', nullable: true })
  body: any;

  @Column({ name: 'ACTION', nullable: true })
  action: string;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({
    name: 'USER_ID',
    foreignKeyConstraintName: 'fk_audit_user',
  })
  user: User;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
