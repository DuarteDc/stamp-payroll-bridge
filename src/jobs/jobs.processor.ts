import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job as BullJob, Queue } from 'bullmq';
import { SatService } from 'src/sat/sat.service';
import { WorkflowLoggerService } from 'src/workflow/workflow-logger.service';
import { Repository } from 'typeorm';
import { Job as JobEntity, JobStatus } from './entities/job.entity';

interface PollingQueueData {
  packageId: string;
  rfc: string;
  jobId: string;
  tenantId: string;
}
@Processor('polling')
export class JobsProcessor extends WorkerHost {
  constructor(
    @InjectQueue('polling')
    private readonly pollingQueue: Queue<PollingQueueData>,
    private readonly satService: SatService,
    private readonly workflowLoggerService: WorkflowLoggerService,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {
    super();
  }

  async process(job: BullJob<PollingQueueData>): Promise<{ success: boolean }> {
    const response = await this.satService.checkStatus(job.data.packageId);
    await this.workflowLoggerService.log(
      job.data.tenantId,
      'Verificando el estatus del paquete...',
      'pending',
      job.data.jobId,
    );
    console.log(job.data);
    if (response.EstadoPaquete === 30) {
      await this.workflowLoggerService.log(
        job.data.tenantId,
        `El paquete ha sido recibido con un estatus satisfactorio ${JSON.stringify(response)}`,
        'success',
        job.data.jobId,
      );
      await this.jobRepository.update(
        { id: job.data.jobId },
        {
          status: JobStatus.TIMBRADO,
        },
      );
      return { success: true };
    } else {
      await this.workflowLoggerService.log(
        job.data.tenantId,
        'El paquete continua en estado pendiente...',
        'pending',
        job.data.jobId,
      );
      await this.pollingQueue.add('verify-status', job.data, {
        delay: 10_000,
        removeOnComplete: true,
        removeOnFail: true,
      });
      throw new Error(`Status ${response.EstadoPaquete}, reintento programado`);
    }
  }
}
