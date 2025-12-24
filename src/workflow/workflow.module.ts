import { Module } from '@nestjs/common';
import { WorkflowLoggerService } from './workflow-logger.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowLog } from './entities/workflow-log.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { WorkflowService } from './workflow.service';
import { WorkflowEventPublisher } from './workflow-event.publisher';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowLog]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisModule,
  ],
  controllers: [WorkflowController],
  providers: [WorkflowLoggerService, WorkflowService, WorkflowEventPublisher],
  exports: [WorkflowLoggerService, WorkflowService, WorkflowEventPublisher],
})
export class WorkflowModule {}
