import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Tenant } from 'src/tenant/entities';
import { SatModule } from 'src/sat/sat.module';
import { JobEvent } from './entities';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Tenant, JobEvent]),
    SatModule,
    BullModule.registerQueue({
      name: 'polling',
    }),
  ],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
