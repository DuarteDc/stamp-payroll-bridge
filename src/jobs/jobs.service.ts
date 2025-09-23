import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Tenant } from 'src/tenant/entities';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SatService } from 'src/sat/sat.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly satService: SatService,
  ) {}

  async createDefaultJob(tenantId: string): Promise<Job> {
    await this.satService.createClient();
    const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
    if (!tenant)
      throw new NotFoundException('El usuario no existe o no es valido');

    const job = await this.jobRepository.save({
      tenant: tenant,
      externalReference: 'default_ref',
      status: 'RECEIVED',
    });

    return job;
  }
}
