import { Injectable } from '@nestjs/common';
import { WorkflowEventPublisher } from './workflow-event.publisher';
import { WorkflowEventType } from './interfaces/workflow-event.interface';
import { Tenant } from 'src/tenant/entities';

@Injectable()
export class WorkflowService {
  constructor(private readonly publisher: WorkflowEventPublisher) {}

  async triggerWorkflowEvent(tenant: Tenant, jobId: string): Promise<void> {
    await this.publisher.publish({
      createdAt: new Date(),
      tenant,
      workflowId: jobId,
      type: WorkflowEventType.CREATED,
      id: crypto.randomUUID(),
    });
  }
}
