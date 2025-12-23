import { JOB_STATUS } from '../constants/job-status.constant';

export interface WorkflowEvent {
  type: (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
  userId: string;
  workflowId: string;
  createdAt: Date;
}
