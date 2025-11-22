import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
