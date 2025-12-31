import { InternalServerErrorException, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './token.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { UserSessionService } from './user-session.service';
import { UserSession } from './entities/user-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTRefreshStrategy } from './strategies/jwt-refresh.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // si usas JwtService

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
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          },
        };
      },
    }),
    PassportModule,
    UsersModule,
    TypeOrmModule.forFeature([UserSession]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserSessionService,
    HashService,
    JWTStrategy,
    JWTRefreshStrategy,
    TokenService,
  ],
  exports: [AuthService, UserSessionService, JWTStrategy, TokenService],
})
export class AuthModule {}
