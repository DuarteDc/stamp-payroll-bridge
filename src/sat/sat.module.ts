import { Module } from '@nestjs/common';
import { SatService } from './sat.service';
import { Job, JobEvent } from 'src/jobs/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureStorageService } from './azure-storage.service';
import { BlobConfigController } from './blob-config.controller';
import { BlobConfigService } from './blob-config.service';
import { BlobConfig } from './entities';
import { PassportModule } from '@nestjs/passport';
import { Tenant } from 'src/tenant/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobEvent, BlobConfig, Tenant]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [SatService, AzureStorageService, BlobConfigService],
  controllers: [BlobConfigController],
  exports: [SatService, AzureStorageService],
})
export class SatModule {}
