import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEvent } from './job-event.entity';
import { Tenant } from '../../tenant/entities';
import { WorkflowLog } from '../../workflow/entities/workflow-log.entity';
import { JOB_STATUS } from '../constants/job-status.constant';

export enum JobType {
  STAMP = 'STAMP',
  CANCEL = 'CANCEL',
}

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
@Entity({ name: 'JOBS' })
export class Job {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'EXTERNAL_REFERENCE', nullable: true })
  externalReference: string;

  @Column({
    name: 'STATUS',
    type: 'varchar2',
    default: JOB_STATUS.SUBMITTED,
  })
  status: JobStatus;

  @Column({
    name: 'TYPE',
    type: 'varchar2',
    default: JobType.STAMP,
  })
  type: string;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => JobEvent, (jobEvent) => jobEvent.job, { cascade: false })
  jobEvents: JobEvent[];

  @OneToMany(() => WorkflowLog, (workflow) => workflow.job, { cascade: false })
  workflows: WorkflowLog[];

  @ManyToOne(() => Tenant, (tenant) => tenant.jobs, { cascade: false })
  @JoinColumn({
    name: 'TENANT_ID',
    foreignKeyConstraintName: 'fk_job_tenant',
  })
  tenant: Tenant;
}

//jobs: id, tenant_id, referencia_externa, status( RECEIVED|SEALED|SUBMITTED|TIMBRADO|ERROR ), created_at
