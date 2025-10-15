import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import { TenantService } from 'src/tenant/tenant.service';

import { LoginTenantDto } from './dto';
import { TokenService } from './token.service';
import { Tenant } from 'src/tenant/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn({ username, password }: LoginTenantDto): Promise<any> {
    const tenant = await this.tenantService.findByUsername(username);
    if (!tenant || !this.hashService.verifyPassword(password, tenant.password))
      throw new BadRequestException('Username or password are not valid');

    return {
      ...tenant,
      accessToken: await this.tokenService.sign({ id: tenant.id }),
    };
  }

  async checkAuthentication(tenant: Tenant) {
    return {
      ...tenant,
      accessToken: await this.tokenService.sign({ id: tenant.id }),
    };
  }
}
