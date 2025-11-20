import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import type { JWTPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ id }: JWTPayload): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) throw new UnauthorizedException('Invalid access token');
    return user;
  }
}
