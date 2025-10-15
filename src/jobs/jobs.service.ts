import { Not, Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { Tenant } from 'src/tenant/entities';

import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SatService } from 'src/sat/sat.service';
import { JobActions } from 'src/common/jobs/constants/job-action.constant';
import { JobEvent } from './entities';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';
import { WorkflowLoggerService } from 'src/workflow/workflow-logger.service';
interface PollingQueueData {
  packageId: string;
  rfc: string;
  jobId: string;
}
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(JobEvent)
    private readonly jobEventRepository: Repository<JobEvent>,
    private readonly satService: SatService,
    @InjectQueue('polling')
    private readonly pollingQueue: Queue<PollingQueueData>,
    private readonly logger: WorkflowLoggerService,
  ) {}

  async createDefaultJob(tenantId: string, filePath: string): Promise<Job> {
    this.logger.log(tenantId, 'Creating new job', 'start');
    const tenant = await this.tenantRepository.findOne({
      where: {
        blobConfigs: {
          status: CommonEntityStatus.TRUE,
        },
        id: tenantId,
      },
      relations: ['blobConfigs'],
    });

    if (!tenant)
      throw new NotFoundException('El usuario no existe o no es valido');

    const hastCurrentJob = await this.jobRepository.findOneBy({
      tenant: { id: tenantId, status: Not(JobStatus.RECEIVED) },
    });

    if (hastCurrentJob) {
      throw new BadRequestException(
        `Ya existe un job en estado recibido con id ${hastCurrentJob.id}`,
      );
    }

    this.logger.log(tenantId, 'Send new Package', 'pendding');
    const newPackage = await this.satService.sendPackageToSat(tenant, filePath);

    const job = await this.jobRepository.save({
      tenant: tenant,
      externalReference: newPackage.IdPaquete,
      status: 'RECEIVED',
    });
    this.logger.log(tenantId, `Job id ${job.id}`, 'pendding');
    const jobDetail = await this.jobEventRepository.save({
      job: job,
      type: JobActions.SEND_PACKAGE_TO_SAT,
      payload: {
        id: job.id,
        tenantId: tenant.id,
        data: newPackage,
      },
    });
    this.logger.log(
      tenantId,
      `new job data  ${JSON.stringify(jobDetail)}`,
      'pendding',
    );
    await this.pollingQueue.add(
      'verify-status',
      { packageId: newPackage.IdPaquete, jobId: job.id, rfc: tenant.rfc },
      {
        attempts: 1,
      },
    );
    this.logger.log(tenantId, `Checking status`, 'pendding');
    return job;
  }

  async findJob(jobId: string, tenantId: string) {
    const job = await this.jobRepository.findOneBy({
      id: jobId,
      tenant: { id: tenantId },
      jobEvents: true,
    });
    if (!job) {
      throw new NotFoundException('No existe un job con el id proporcionado');
    }
    console.log(job.externalReference);
    return this.satService.checkStatus(job.externalReference);
  }
}
