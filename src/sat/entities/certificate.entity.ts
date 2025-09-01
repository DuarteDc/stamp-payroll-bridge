import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TypeCertificate {
  CSD = 'CSD',
  FIEL = 'FIEL',
}

export enum Status {
  TRUE = '1',
  FALSE = '0',
}
@Entity({ name: 'CERTIFICATES' })
export class Certificates {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'TYPE', type: 'varchar2', default: TypeCertificate.CSD })
  type: string;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.certificates)
  @JoinColumn({
    name: 'TENANT_ID',
    foreignKeyConstraintName: 'fk_certificate_tenant',
  })
  tenant: TenantEntity;

  @Column({ name: 'SERIAL_NUMBER' })
  serialNumber: string;

  @Column({ name: 'FILE' })
  file: string;

  @Column({ name: 'STATUS', type: 'char', default: Status.TRUE })
  status: string;

  @Column({ name: 'EXPIRED_AT', type: 'timestamp' })
  expriedAt: Date;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
