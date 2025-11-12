import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';
import { Tenant } from 'src/tenant/entities';

@Entity({ name: 'DEPENDENCIES' })
export class Dependency {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'STATUS', type: 'char', default: CommonEntityStatus.TRUE })
  status: string;

  @Column({ name: 'ABBREVIATION' })
  abbreviation: string;

  @OneToMany(() => Tenant, (tenant) => tenant.dependency)
  tenants: Tenant[];

  @Column({ name: 'RFC' })
  rfc: string;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
