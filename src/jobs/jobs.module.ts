import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Tenant } from 'src/tenant/entities';
import { SatModule } from 'src/sat/sat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Tenant]), SatModule],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
