import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BlobConfigService } from './blob-config.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateSasDto } from './entities/dtos/create-sas.dto';
import { AuditAction } from 'src/audit/decorators/audit-action.decorator';
import { User } from 'src/users/entities/user.entity';
import { User as GetUser } from 'src/auth/decorators/user.decorator';
@Controller('blob-config')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
export class BlobConfigController {
  constructor(private readonly blobConfigService: BlobConfigService) {}

  @AuditAction('view', 'get all sas configuration', '/configuration')
  @Get('')
  getAll() {
    return this.blobConfigService.getActiveSAS();
  }

  @Post(':id')
  @AuditAction('update', 'register new sas', '/configuration/{id}')
  createNewSas(
    @Param('id') id: string,
    @Body() createSasDto: CreateSasDto,
    @GetUser() user: User,
  ) {
    return this.blobConfigService.createSas(id, createSasDto, user);
  }

  @Get('/history/:id')
  getHistoryOfSas(@Param('id') id: string) {
    return this.blobConfigService.getHistoryOfSas(id);
  }
}
