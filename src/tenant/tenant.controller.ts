import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';
import { CreateTenantDto } from './dtos/create-tenant.dto';

@Controller('tenants')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('/')
  async getAllTenants() {
    return await this.tenantService.findAll();
  }

  @Post('')
  async create(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenantService.save(createTenantDto);
  }
}
