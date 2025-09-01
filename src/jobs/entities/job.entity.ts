import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobEvent } from './job-event.entity';

export enum JobStatus {
  RECEIVED = 'RECEIVED',
  SEALED = 'SEALED',
  SUBMITTED = 'SUBMITTED',
  TIMBRADO = 'TIMBRADO',
  ERROR = 'ERROR',
}

@Entity({ name: 'JOBS' })
export class Job {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({
    name: 'TENANT_ID',
  })
  tenantId: number;

  @Column({ name: 'EXTERNAL_REFERENCE' })
  externalReference: string;

  @Column({
    name: 'STATUS',
    type: 'varchar2',
    default: JobStatus.RECEIVED,
  })
  status: string;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => JobEvent, (jobEvent) => jobEvent.job, { cascade: false })
  jobEvents: JobEvent[];
}

//jobs: id, tenant_id, referencia_externa, status( RECEIVED|SEALED|SUBMITTED|TIMBRADO|ERROR ), created_at
