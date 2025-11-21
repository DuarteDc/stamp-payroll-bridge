import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  controllers: [UserController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    TenantModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
