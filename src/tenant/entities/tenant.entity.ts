import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Job } from '../../jobs/entities';
import { Certificate, BlobConfig } from '../../sat/entities';
import { CommonEntityStatus } from '../../common/types/common-entity-status.type';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'TENANTS' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'ABBREVIATION' })
  abbreviation: string;

  @Column({ name: 'RFC' })
  rfc: string;

  @Column({ name: 'STATUS', type: 'char', default: CommonEntityStatus.TRUE })
  status: string;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Certificate, (certificate) => certificate.tenant)
  certificates: Certificate[];

  @OneToMany(() => Job, (job) => job.tenant)
  jobs: Job[];

  @OneToMany(() => BlobConfig, (blobConfig) => blobConfig.tenant)
  blobConfigs: BlobConfig[];
}
