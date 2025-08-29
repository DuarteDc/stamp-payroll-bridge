import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TypeCertificate {
  CSD = 'CSD',
  FIEL = 'FIEL',
}
@Entity()
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TypeCertificate,
    default: TypeCertificate.CSD,
  })
  type: string;

  @Column()
  tenant_id: number;

  @Column()
  serial_number: string;

  @Column({
    type: 'datetime',
  })
  expires_at: Date;

  @Column()
  file_cer: string;

  @Column()
  status: boolean;
}
// certificates: id, tenant_id, tipo(CSD/FIEL), numero_serie, vence_en, archivo(.cer/.key/.pfx), pass_encrypted, estado
