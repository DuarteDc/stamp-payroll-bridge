import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SatService } from 'src/sat/sat.service';
import { WorkflowLoggerService } from 'src/workflow/workflow-logger.service';

interface PollingQueueData {
  packageId: string;
  rfc: string;
  jobId: string;
}
@Processor('polling')
export class JobsProcessor extends WorkerHost {
  constructor(
    @InjectQueue('polling')
    private readonly pollingQueue: Queue<PollingQueueData>,
    private readonly satService: SatService,
    private readonly workflowLoggerService: WorkflowLoggerService,
  ) {
    super();
  }

  async process(job: Job): Promise<{ success: boolean }> {
    const response = await this.satService.checkStatus(job.data.packageId);
    console.log(job.data);
    if (response.EstadoPaquete === 30) {
      await this.workflowLoggerService.log(
        job.data.tenantId,
        'package finished with success status',
        'success',
      );
      return { success: true };
    } else {
      await this.workflowLoggerService.log(
        job.data.tenantId,
        'package checking status and response with status: pending',
        'pending',
      );
      await this.pollingQueue.add('verify-status', job.data, {
        delay: 30_000,
        removeOnComplete: true,
        removeOnFail: true,
      });
      throw new Error(`Status ${response.EstadoPaquete}, reintento programado`);
    }
  }
}
