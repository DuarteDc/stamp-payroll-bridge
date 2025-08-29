import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum JobStatus {
  RECEIVED = 'RECEIVED',
  SEALED = 'SEALED',
  SUBMITTED = 'SUBMITTED',
  TIMBRADO = 'TIMBRADO',
  ERROR = 'ERROR',
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: number;

  @Column()
  external_reference: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.RECEIVED,
  })
  status: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}

//jobs: id, tenant_id, referencia_externa, status( RECEIVED|SEALED|SUBMITTED|TIMBRADO|ERROR ), created_at
