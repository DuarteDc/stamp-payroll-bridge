import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowLog } from './entities/workflow-log.entity';
import { Tenant } from 'src/tenant/entities';
import { Job, JobStatus } from 'src/jobs/entities/job.entity';
import { interval, map } from 'rxjs';

@Injectable()
export class WorkflowLoggerService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(WorkflowLog)
    private readonly logRepository: Repository<WorkflowLog>,
    @InjectRepository(WorkflowLog)
    private readonly jobRepository: Repository<Job>,
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

    this.eventEmitter.emit(`workflow.${jobId}`, log);

    return log;
  }

  async getLogsByJob(jobId: string) {
    return this.logRepository.find({
      where: { job: { id: jobId } },
      order: { timestamp: 'ASC' },
    });
  }

  async getLogsByTenant(tenantId: string, jobId: string) {
    return await this.logRepository.find({
      where: {
        tenant: { id: tenantId },
        job: {
          id: jobId,
        },
      },
      order: { timestamp: 'ASC' },
    });
  }

  async getWorkflowStatusSteam(tenantId: string) {
    const getActivePayrollProcess = await this.jobRepository.find({
      where: {
        tenant: { id: tenantId },
        status: JobStatus.RECEIVED,
      },
    });
    console.log(getActivePayrollProcess);
    return getActivePayrollProcess;
  }
}
