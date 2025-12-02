import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant.controller';
import { PassportModule } from '@nestjs/passport';
import { BlobConfig } from 'src/sat/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, BlobConfig]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
