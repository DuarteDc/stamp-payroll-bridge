import type { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuditService } from './audit.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import * as nestjsPaginate from 'nestjs-paginate';

@Controller('audit')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}
  @Get(':id')
  findByUser(
    @Param('id') id: string,
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ) {
    return this.auditService.findByUser(id, query);
  }

  @Post('track')
  tranckFrontend(@Body() body: { path: string }, @Req() request: Request) {
    return this.auditService.create({
      ip: request.ip ?? '',
      userAgent: request.headers['user-agent'] ?? '',
      method: 'FRONTEND_NAVIGATION',
      path: body.path,
      body: null,
      // action: null,
    });
  }
}
