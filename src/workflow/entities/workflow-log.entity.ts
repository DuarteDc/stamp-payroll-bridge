import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/';
import { Job } from '../../jobs/entities/';

@Entity('WORKFLOW_LOGS')
export class WorkflowLog {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({
    name: 'TENANT_ID',
    foreignKeyConstraintName: 'fk_tenant_workflow_log',
  })
  tenant: Tenant;

  @ManyToOne(() => Job, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({
    name: 'JOB_ID',
    foreignKeyConstraintName: 'fk_job_workflow_log',
  })
  job?: Job;

  @Column({ name: 'STEP', type: 'clob' })
  step: string;

  @Column({ type: 'varchar', default: 'pending', name: 'STATUS' })
  status: 'start' | 'pending' | 'success' | 'error';

  @Column({ name: 'ATTEMPTS', type: 'int', default: 1 })
  attempts: number;

  @Column({
    name: 'LAST_UPDATE',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;

  @CreateDateColumn()
  timestamp: Date;
}
