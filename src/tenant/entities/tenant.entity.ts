import { Job } from '../../jobs/entities';
import { Certificate } from '../../sat/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  TRUE = '1',
  FALSE = '0',
}

@Entity({ name: 'TENANTS' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'RFC' })
  rfc: string;

  @Column({ name: 'STATUS', type: 'char', default: Status.TRUE })
  status: string;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Certificate, (certificate) => certificate.tenant)
  certificates: Certificate[];

  @OneToMany(() => Job, (job) => job.tenant)
  jobs: Job[];
}
