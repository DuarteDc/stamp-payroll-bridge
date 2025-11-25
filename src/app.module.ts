import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StampModule } from './stamp/stamp.module';
import { UnzipModule } from './unzip/unzip.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs/entities/job.entity';
import { envs } from './config/envs';
import { JobEvent } from './jobs/entities';
import { SatModule } from './sat/sat.module';
import { Certificate } from './sat/entities';
import { TenantModule } from './tenant/tenant.module';
import { Tenant } from './tenant/entities';

import { BullModule } from '@nestjs/bullmq';
import { JobsModule } from './jobs/jobs.module';
import { BlobConfig } from './sat/entities/blob-config.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WorkflowModule } from './workflow/workflow.module';
import { WorkflowLog } from './workflow/entities/workflow-log.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuditModule } from './audit/audit.module';
import { AuditLog } from './audit/entities/audit-log.entity';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', 'uploads'),
        filename: (_req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
    StampModule,
    UnzipModule,
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      schema: envs.dbSchema,
      serviceName: envs.dbSid,
      password: envs.dbPassword,
      entities: [
        Job,
        JobEvent,
        Certificate,
        Tenant,
        BlobConfig,
        WorkflowLog,
        User,
        AuditLog,
      ],
      synchronize: true,
    }),
    TenantModule,
    BullModule.forRoot({
      connection: {
        host: envs.redisHost,
        port: envs.redisPort,
      },
    }),
    WorkflowModule,
    SatModule,
    JobsModule,
    UsersModule,
    AuthModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
