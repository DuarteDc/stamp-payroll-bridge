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

  async signIn({ username, password }: LoginTenantDto) {
    const tenant = await this.tenantService.findByUsername(username);
    if (!tenant || !this.hashService.verifyPassword(password, tenant.password))
      throw new BadRequestException('El usuario o contraseña no son validos');

    const { password: __, ...tenantWithoutPassword } = tenant;
    return {
      ...tenantWithoutPassword,
      accessToken: await this.tokenService.sign({ id: tenant.id }),
    };
  }

  async checkAuthentication(tenant: Tenant) {
    const { password: __, ...tenantWithoutPassword } = tenant;
    return {
      ...tenantWithoutPassword,
      accessToken: await this.tokenService.sign({ id: tenant.id }),
    };
  }
}
