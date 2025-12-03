import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { UpdateTenantDto } from './dtos';
import { AuditAction } from 'src/audit/decorators/audit-action.decorator';

@Controller('tenants')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('/')
  async getAllTenants() {
    return await this.tenantService.findAll();
  }

  @AuditAction('create', 'create new entity', '/configuration')
  @Post('')
  async create(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenantService.save(createTenantDto);
  }
  @AuditAction('update', 'update entity', '/configuration')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return await this.tenantService.updateTenant(id, updateTenantDto);
  }

  @AuditAction('delete', 'disable entity', 'configuration/{id}')
  @Patch('/disable/:id')
  async disable(@Param('id') id: string) {
    return await this.tenantService.enableAndDisableTenant(id);
  }
}
