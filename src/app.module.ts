import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    StampModule,
    UnzipModule,
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbSchema,
      password: envs.dbPassword,
      entities: [Job, JobEvent, Certificate, Tenant, BlobConfig],
      synchronize: true,
    }),
    TenantModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    SatModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
