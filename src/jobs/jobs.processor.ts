import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SatService } from 'src/sat/sat.service';

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
  ) {
    super();
  }

  async process(job: Job): Promise<{ success: boolean }> {
    const response = await this.satService.consultarEstado(job.data.packageId);
    if (response.EstadoPaquete === 30) {
      return { success: true };
    } else {
      await this.pollingQueue.add('verify-status', job.data, {
        delay: 30_000,
        removeOnComplete: true,
        removeOnFail: true,
      });
      throw new Error(`Status ${response.EstadoPaquete}, reintento programado`);
    }
  }
}
