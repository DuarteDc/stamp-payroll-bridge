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

  async findAll(query: PaginateQuery, date?: string, method?: string) {
    const queryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .leftJoin('audit.user', 'user')
      .leftJoin('user.tenant', 'tenant')
      .addSelect([
        'user.id',
        'user.name',
        'user.username',
        'user.role',
        'tenant.id',
        'tenant.name',
        'tenant.abbreviation',
        'tenant.rfc',
      ]);

    if (date) {
      const start = new Date(`${date} 00:00:00`);
      const end = new Date(`${date} 23:59:59.999`);

      queryBuilder.andWhere('audit.createdAt BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    if (method) {
      queryBuilder.andWhere('audit.method = :method', {
        method: method.toUpperCase(),
      });
    }

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'createdAt', 'path'],
      nullSort: 'first',
      maxLimit: 10,
      relations: ['user', 'user.tenant'],
      searchableColumns: [
        'action',
        'method',
        'action',
        'createdAt',
        'path',
        'user.name',
        'user.username',
        'user.tenant.name',
        'user.tenant.rfc',
        'user.tenant.abbreviation',
      ],
      defaultSortBy: [['createdAt', 'DESC']],
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
