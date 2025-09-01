import { Certificates } from 'src/sat/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  TRUE = '1',
  FALSE = '0',
}

@Entity({ name: 'TENANTS' })
export class TenantEntity {
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

  @OneToMany(() => Certificates, (certificate) => certificate.tenant)
  certificates: Certificates[];
}
