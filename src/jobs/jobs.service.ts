import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async createDefaultJob(): Promise<Job> {
    const job = await this.jobRepository.save({
      tenantId: 1,
      externalReference: 'default_ref',
      status: 'RECEIVED',
    });

    return job;
  }
}
