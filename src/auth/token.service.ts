import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });
  }

  verify(token: string): object {
    return this.jwtService.verify<object>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  verifyRefreshToken(token: string): object {
    return this.jwtService.verify<object>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }
}
