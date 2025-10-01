import { Module } from '@nestjs/common';
import { SatService } from './sat.service';
import { Job, JobEvent } from 'src/jobs/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureStorageService } from './azure-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobEvent])],
  providers: [SatService],
  exports: [SatService, AzureStorageService],
})
export class SatModule {}
