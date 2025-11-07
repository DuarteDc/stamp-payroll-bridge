import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Tenant } from 'src/tenant/entities';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SatService } from 'src/sat/sat.service';
import { JobActions } from 'src/common/jobs/constants/job-action.constant';
import { JobEvent } from './entities';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';
import { WorkflowLoggerService } from 'src/workflow/workflow-logger.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
interface PollingQueueData {
  packageId: string;
  rfc: string;
  jobId: string;
  tenantId: string;
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

  async createDefaultJob(tenantRfc: string, filePath: string): Promise<Job> {
    const tenant = await this.tenantRepository.findOne({
      where: {
        blobConfigs: {
          status: CommonEntityStatus.TRUE,
        },
        rfc: tenantRfc,
      },
      relations: ['blobConfigs'],
    });

    if (!tenant)
      throw new NotFoundException('El usuario no existe o no es valido');

    let job = await this.jobRepository.save({
      tenant: tenant,
      status: 'RECEIVED',
    });
    await this.logger.log(
      tenant.id,
      `Iniciando proceso de timbrado de nomina, por el usuario: ${tenant.name} - ${tenant.rfc}`,
      'start',
      job.id,
    );
    await this.logger.log(
      tenant.id,
      `Enviando el paquete al SAT`,
      'start',
      job.id,
    );
    const newPackage = await this.satService.sendPackageToSat(tenant, filePath);
    await this.logger.log(
      tenant.id,
      `EL paquete se envío al sat con el identificador ${newPackage.IdPaquete}`,
      'pending',
      job.id,
    );

    job.externalReference = newPackage.IdPaquete;
    job = await this.jobRepository.save(job);
    await this.logger.log(
      tenant.id,
      `Identificador del ${job.id}`,
      'pending',
      job.id,
    );
    await this.jobEventRepository.save({
      job: job,
      type: JobActions.SEND_PACKAGE_TO_SAT,
      payload: {
        id: job.id,
        tenantId: tenant.id,
        data: newPackage,
      },
    });
    await this.logger.log(
      tenant.id,
      `El proceso se asigno correctamente al usuario ${tenant.name} y al paquete ${newPackage.IdPaquete}`,
      'pending',
      job.id,
    );
    await this.pollingQueue.add(
      'verify-status',
      {
        packageId: newPackage.IdPaquete,
        jobId: job.id,
        rfc: tenant.rfc,
        tenantId: tenant.id,
      },
      {
        attempts: 1,
      },
    );
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
    return this.satService.checkStatus(job.externalReference);
  }

  async findJobsByTenant(query: PaginateQuery, tenantId: string) {
    return paginate(query, this.jobRepository, {
      sortableColumns: ['id', 'createdAt', 'externalReference'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      where: {
        tenant: {
          id: tenantId,
        },
      },
      defaultLimit: 10,
    });
  }

  async findJobDetail(jobId: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
      relations: {
        workflows: true,
      },
    });
    if (!job) {
      throw new NotFoundException('No existe un job con el id proporcionado');
    }
    return job;
  }
}
