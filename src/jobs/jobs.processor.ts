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
    private readonly satService: SatService,
    @InjectQueue('polling')
    private readonly pollingQueue: Queue<PollingQueueData>,
  ) {
    super();
  }

  async process(job: Job): Promise<{ success: boolean }> {
    const response = await this.satService.consultarEstado(job.data.packageId);
    if (response.EstadoPaquete !== 3) {
      return { success: true };
    } else {
      await this.pollingQueue.add('verify-status', job.data, { delay: 1000 });
      throw new Error(`Status ${response.EstadoPaquete}, reintento programado`);
    }
  }
}
