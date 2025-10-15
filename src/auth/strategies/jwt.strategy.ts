import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { TenantService } from 'src/tenant/tenant.service';

import type { JWTPayload } from '../interfaces/jwt-payload.interface';
import { Tenant } from 'src/tenant/entities';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tenantService: TenantService,
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

  async validate({ id }: JWTPayload): Promise<Tenant> {
    const tenant = await this.tenantService.findOne(id);
    if (!tenant) throw new UnauthorizedException('Invalid access token');
    return tenant;
  }
}
