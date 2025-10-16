import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: JWTPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: envs.jwtSecretKey,
    });
  }

  verify(token: string): object {
    return this.jwtService.verify<object>(token, {
      secret: envs.jwtSecretKey,
    });
  }

  verifyRefreshToken(token: string): object {
    return this.jwtService.verify<object>(token, {
      secret: envs.jwtSecretKey,
    });
  }
}
