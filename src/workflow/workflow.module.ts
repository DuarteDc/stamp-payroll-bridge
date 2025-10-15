import { Module } from '@nestjs/common';
import { WorkflowLoggerService } from './workflow-logger.service';
import { WorkflowController } from './workflow.controller';

@Module({
  controllers: [WorkflowController],
  providers: [WorkflowLoggerService],
  exports: [WorkflowLoggerService],
})
export class WorkflowModule {}
