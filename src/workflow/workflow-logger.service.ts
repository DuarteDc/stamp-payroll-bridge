import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowLog } from './entities/workflow-log.entity';
import { Tenant } from 'src/tenant/entities';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class WorkflowLoggerService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(WorkflowLog)
    private readonly logRepository: Repository<WorkflowLog>,
  ) {}

  async log(
    tenantId: string,
    step: string,
    status: 'start' | 'pending' | 'success' | 'error' = 'pending',
    jobId?: string,
  ) {
    const log = this.logRepository.create({
      tenant: { id: tenantId } as Tenant,
      job: jobId ? ({ id: jobId } as Job) : undefined,
      step,
      status,
    });

    await this.logRepository.save(log);

    this.eventEmitter.emit(`workflow.${tenantId}`, log);

    return log;
  }

  async getLogsByJob(jobId: string) {
    return this.logRepository.find({
      where: { job: { id: jobId } },
      order: { timestamp: 'ASC' },
    });
  }

  async getLogsByTenant(tenantId: string) {
    return this.logRepository.find({
      where: { tenant: { id: tenantId } },
      order: { timestamp: 'ASC' },
    });
  }
}
