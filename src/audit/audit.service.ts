import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';
import { CreateAuditDto } from './dtos/create-audit.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditDto: CreateAuditDto) {
    const log = this.auditRepository.create(createAuditDto);
    return await this.auditRepository.save(log);
  }

  async findAll() {
    return await this.auditRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string) {
    return await this.auditRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
      },
    });
  }
}
