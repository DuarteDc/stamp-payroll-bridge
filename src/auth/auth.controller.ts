import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LoginTenantDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { Tenant as GetTenant } from './decorators/tenant.decorator';
import { Tenant } from 'src/tenant/entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginTenantDto: LoginTenantDto) {
    return this.authService.signIn(loginTenantDto);
  }

  @Get('refresh')
  @UseGuards(AuthGuard())
  refreshToken(@GetTenant() tenant: Tenant) {
    return this.authService.checkAuthentication(tenant);
  }

  @Put(':id')
  updateTenantProfile() {
    return 'xd';
  }
}
