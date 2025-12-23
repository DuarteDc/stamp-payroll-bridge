import { Module } from '@nestjs/common';
import { WorkflowLoggerService } from './workflow-logger.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowLog } from './entities/workflow-log.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { WorkflowEventBusService } from 'src/jobs/workflow-event-bus.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowLog]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WorkflowController],
  providers: [WorkflowLoggerService, WorkflowEventBusService],
  exports: [WorkflowLoggerService, WorkflowEventBusService],
})
export class WorkflowModule {}
