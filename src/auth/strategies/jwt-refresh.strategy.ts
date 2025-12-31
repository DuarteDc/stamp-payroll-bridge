import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/users/user.service';
import { UserSessionService } from '../user-session.service';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from '../interfaces/jwt-payload.interface';
@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: UserSessionService,
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

  async validate(payload: JWTPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionService.findActiveByUser(user.id);

    if (!session) {
      throw new UnauthorizedException('Session expired');
    }

    if (session.refreshTokenId !== payload.jti) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    return { user, session };
  }
}
