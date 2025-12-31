import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginTenantDto } from './dto';
import { AuthService } from './auth.service';

import { User } from 'src/users/entities/user.entity';
import { AuditAction } from 'src/audit/decorators/audit-action.decorator';
import { UserSessionService } from './user-session.service';
import type { Request } from 'express';
import dayjs from 'dayjs';
import { JWTRefreshGuard } from './guards/jwt-refresh.guard';
import { Session } from './decorators/session.decorator';
import { UserSession } from './entities/user-session.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
  ) {}

  @AuditAction()
  @Post('/login')
  async login(@Body() loginTenantDto: LoginTenantDto, @Req() request: Request) {
    const { user, refreshJti, ...tokens } =
      await this.authService.signIn(loginTenantDto);

    await this.userSessionService.save({
      user: user as User,
      refreshTokenId: refreshJti,
      ip: request?.ip ?? '',
      userAgent: request?.headers['user-agent'] ?? '',
      expiresAt: dayjs().add(7, 'day').toDate(),
    });

    return {
      user,
      refreshJti,
      ...tokens,
    };
  }

  @Get('/refresh')
  @UseGuards(JWTRefreshGuard)
  refreshToken(
    @Session() { session, user }: { session: UserSession; user: User },
  ) {
    return this.authService.refreshTokens(session, user);
  }

  @Put(':id')
  updateTenantProfile() {
    return 'xd';
  }
}
