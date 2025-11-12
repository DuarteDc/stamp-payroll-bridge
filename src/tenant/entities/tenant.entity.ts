import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Job } from '../../jobs/entities';
import { Certificate, BlobConfig } from '../../sat/entities';
import { CommonEntityStatus } from '../../common/types/common-entity-status.type';
import { Dependency } from 'src/dependency/entities/dependency.entity';

@Entity({ name: 'TENANTS' })
export class Tenant {
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

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Dependency, (dependency) => dependency.tenants)
  @JoinColumn({
    name: 'DEPENDENCY_ID',
    foreignKeyConstraintName: 'fk_dependency_tenant',
  })
  dependency: Dependency;

  @OneToMany(() => Certificate, (certificate) => certificate.tenant)
  certificates: Certificate[];

  @OneToMany(() => Job, (job) => job.tenant)
  jobs: Job[];

  @OneToMany(() => BlobConfig, (blobConfig) => blobConfig.tenant)
  blobConfigs: BlobConfig[];
}
