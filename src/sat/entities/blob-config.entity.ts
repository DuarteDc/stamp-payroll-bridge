import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entities';
import { CommonEntityStatus } from '../../common/types/common-entity-status.type';

@Entity({
  name: 'BLOB_CONFIG',
})
export class BlobConfig {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'CONTAINER_NAME', type: 'varchar2' })
  containerName: string;

  @Column({ name: 'STATUS', type: 'char', default: CommonEntityStatus.TRUE })
  status: string;

  @Column({ name: 'SAS_TOKEN' })
  sasToken: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.blobConfigs)
  @JoinColumn({
    name: 'TENANT_ID',
    foreignKeyConstraintName: 'fk_tenant_blobconfig',
  })
  tenant: Tenant;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
