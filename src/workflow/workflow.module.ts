import { Module } from '@nestjs/common';
import { WorkflowLoggerService } from './workflow-logger.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowLog } from './entities/workflow-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowLog])],
  controllers: [WorkflowController],
  providers: [WorkflowLoggerService],
  exports: [WorkflowLoggerService],
})
export class WorkflowModule {}
