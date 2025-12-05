import { Repository } from 'typeorm';
import { Job, JobStatus, JobType } from './entities/job.entity';
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

  async findJobsByTenant(
    query: PaginateQuery,
    tenantId: string,
    date?: string,
  ) {
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.tenant', 'tenant');

    if (date) {
      const start = new Date(`${date} 00:00:00`);
      const end = new Date(`${date} 23:59:59.999`);

      queryBuilder.andWhere('job.createdAt BETWEEN :start AND :end', {
        start,
        end,
      });
    }
    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'createdAt', 'externalReference'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: [
        'externalReference',
        'id',
        'status',
        'createdAt',
        'tenant.name',
        'tenant.rfc',
      ],
      where: {
        tenant: {
          id: tenantId,
        },
      },
      relations: ['tenant'],
      defaultLimit: 10,
    });
  }

  async findAllJobs(query: PaginateQuery, date?: string) {
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.tenant', 'tenant');

    if (date) {
      const start = new Date(`${date} 00:00:00`);
      const end = new Date(`${date} 23:59:59.999`);

      queryBuilder.andWhere('job.createdAt BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'createdAt', 'externalReference'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: [
        'externalReference',
        'id',
        'status',
        'createdAt',
        'tenant.name',
        'tenant.rfc',
      ],
      relations: ['tenant'],
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

  async startCancelProcess(rfc: string, _file: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { rfc, status: CommonEntityStatus.TRUE },
    });
    if (!tenant) {
      throw new BadRequestException('El rfc de la entidad no es valido');
    }

    let job = await this.jobRepository.save({
      tenant: tenant,
      status: JobStatus.IN_PROGRESS,
      externalReference: 'PKG' + Math.floor(Math.random() * 1000000),
      type: JobType.CANCEL,
    });
    await this.logger.log(
      tenant.id,
      `Iniciando el proceso de cancelacion para ${tenant.name} - ${tenant.rfc}`,
      'start',
      job.id,
    );

    await this.logger.log(
      tenant.id,
      'Creando conexión SOAP',
      'pending',
      job.id,
    );

    await this.logger.log(
      tenant.id,
      'Estableciendo WS-Security',
      'pending',
      job.id,
    );

    await this.logger.log(
      tenant.id,
      'Creando cuerpo de la peticion',
      'start',
      job.id,
    );

    await this.logger.log(
      tenant.id,
      'Enviando cancelación al SAT',
      'start',
      job.id,
    );

    job.status = JobStatus.CANCELADO;

    job = await this.jobRepository.save(job);

    const response = {
      uriZipEnviado: 'https://.../cancelacion.zip?sv...',
      respuestaSat: {
        UrlSalida: 'https://.../acuseCancelacion.zip?sv...',
        Respuesta: 'La cancelación de los comprobantes ha concluido.',
        CodRespuesta: 200,
      },
    };
    await this.logger.log(
      tenant.id,
      `El SAT respondio la siguiente informacion ${JSON.stringify(response)}`,
      'start',
      job.id,
    );
    return response;
  }
}
