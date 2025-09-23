import { Module } from '@nestjs/common';
import { SatService } from './sat.service';
import { Job, JobEvent } from 'src/jobs/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobEvent])],
  providers: [SatService],
  exports: [SatService],
})
export class SatModule {}
