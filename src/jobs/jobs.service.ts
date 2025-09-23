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
  ) {}

  async createDefaultJob(tenantId: string): Promise<Job> {
    const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
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
    const newPackage = this.satService.sendPackageToSat(
      tenant.rfc,
      'https://fake-blob/1234567890.zip',
    );

    const job = await this.jobRepository.save({
      tenant: tenant,
      externalReference: newPackage.IdPaquete,
      status: 'RECEIVED',
    });

    await this.jobEventRepository.save({
      job: job,
      type: JobActions.SEND_PACKAGE_TO_SAT,
      payload: {
        id: job.id,
        tenantId: tenant.id,
        data: newPackage,
      },
    });
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
    return this.satService.consultarEstado(job.externalReference);
  }
}
