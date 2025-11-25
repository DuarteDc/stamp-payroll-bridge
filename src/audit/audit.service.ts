import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';
import { CreateAuditDto } from './dtos/create-audit.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';

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

  async findByUser(userId: string, query: PaginateQuery) {
    return paginate(query, this.auditRepository, {
      sortableColumns: ['id', 'createdAt', 'path'],
      nullSort: 'first',
      maxLimit: 10,
      searchableColumns: ['action', 'method', 'action'],
      defaultSortBy: [['createdAt', 'DESC']],
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
