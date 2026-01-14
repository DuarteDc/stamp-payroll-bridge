import type { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuditService } from './audit.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import * as nestjsPaginate from 'nestjs-paginate';
import { User } from 'src/users/entities/user.entity';
import { User as GetUser } from 'src/auth/decorators/user.decorator';
@Controller('audit')
@UseGuards(AuthGuard(), RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('user')
  getLogsByAuthenticatedUser(
    @GetUser() user: User,
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ) {
    return this.auditService.findByUser(user.id, query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findByUser(
    @Param('id') id: string,
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ) {
    return this.auditService.findByUser(id, query);
  }

  @Get('')
  @Roles(UserRole.ADMIN)
  getAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
    @Query('date') date?: string,
    @Query('method') method?: string,
  ) {
    return this.auditService.findAll(query, date, method);
  }

  @Post('track')
  @Roles(UserRole.ADMIN)
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
