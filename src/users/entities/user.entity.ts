import { BlobConfig } from '../../sat/entities/blob-config.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { CommonEntityStatus } from '../../common/types/common-entity-status.type';
import { Tenant } from '../../tenant/entities/tenant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSession } from 'src/auth/entities/user-session.entity';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'USERNAME' })
  username: string;

  @Column({ name: 'PASSWORD' })
  password: string;

  @Column({ name: 'STATUS', type: 'char', default: CommonEntityStatus.TRUE })
  status: string;

  @Column({ name: 'ROLE' })
  role: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({
    name: 'TENANT_ID',
    foreignKeyConstraintName: 'fk_tenant_user',
  })
  tenant: Tenant;

  @OneToMany(() => BlobConfig, (blobConfig) => blobConfig.user)
  blobConfigs: BlobConfig[];

  @OneToMany(() => AuditLog, (audit) => audit.user)
  auditLogs: AuditLog[];

  @OneToMany(() => UserSession, (userSession) => userSession.user)
  useSessions: UserSession[];

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'UPDATED_AT',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
