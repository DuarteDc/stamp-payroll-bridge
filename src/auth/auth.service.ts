import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from './hash.service';

import { LoginTenantDto } from './dto';
import { TokenService } from './token.service';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
import { randomUUID } from 'crypto';
import { UserSessionService } from './user-session.service';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn({ username, password }: LoginTenantDto) {
    const user = await this.userService.findByUsername(username);
    if (!user || !this.hashService.verifyPassword(password, user.password))
      throw new BadRequestException('El usuario o contraseña no son validos');

    const { password: __, ...tenantWithoutPassword } = user;
    const session = await this.generateTokens(user);
    return {
      user: tenantWithoutPassword,
      ...session,
    };
  }

  async checkAuthentication(user: User) {
    const { password: __, ...tenantWithoutPassword } = user;
    return {
      ...tenantWithoutPassword,
      accessToken: await this.generateTokens(user),
    };
  }

  async refreshTokens(session: UserSession, user: User) {
    if (session.revokedAt) {
      throw new UnauthorizedException('Session revoked');
    }
    const tokens = await this.generateTokens(user);

    await this.userSessionService.update(session.id, {
      refreshTokenId: tokens.refreshJti,
      lastActivityAt: new Date(),
    });

    return {
      user,
      refreshJti: tokens.refreshJti,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async generateTokens(user: User) {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();
    const accessToken = await this.tokenService.sign(
      { id: user.id, type: 'access', jti: accessJti },
      900,
    );

    const refreshToken = await this.tokenService.sign(
      { id: user.id, jti: refreshJti, type: 'refresh' },
      604800,
    );

    return {
      accessToken,
      refreshJti,
      refreshToken,
    };
  }
}
