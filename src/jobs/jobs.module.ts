import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
