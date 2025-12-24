import { Tenant } from 'src/tenant/entities';

export enum WorkflowEventType {
  CREATED = 'CREATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
}

export interface WorkflowEvent {
  id: string;
  type: WorkflowEventType;
  workflowId: string;
  tenant: Tenant;
  createdAt: Date;
}
