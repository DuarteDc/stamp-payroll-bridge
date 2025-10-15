import { InternalServerErrorException, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { HashService } from './hash.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './token.service';
import { JWTStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const JWT_SECRET_KEY = configService.get('JWT_SECRET_KEY') as string;
        if (!JWT_SECRET_KEY)
          throw new InternalServerErrorException('Please configure .env file');
        return {
          secret: JWT_SECRET_KEY,
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
    PassportModule,
    TenantModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, JWTStrategy, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
