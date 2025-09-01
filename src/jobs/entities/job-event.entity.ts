import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from './job.entity';

export interface PAYLOAD {
  id: string;
  data: any;
}
@Entity({
  name: 'JOB_EVENTS',
})
export class JobEvent {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'TYPE' })
  type: string;

  @Column({ name: 'PAYLOAD', type: 'simple-json' })
  payload: PAYLOAD;

  @ManyToOne(() => Job, (job) => job.jobEvents)
  @JoinColumn({
    name: 'JOB_ID',
    foreignKeyConstraintName: 'fk_job_jobevent_id',
  })
  job: Job;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
