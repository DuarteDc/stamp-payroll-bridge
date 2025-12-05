import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, Paginated, type PaginateQuery } from 'nestjs-paginate';

import { JobsService } from './jobs.service';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { Job } from './entities';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/auth/constants/user-role.constant';

@Controller('jobs')
@UseGuards(AuthGuard())
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/')
  async findAll(
    @Paginate() query: PaginateQuery,
    @GetUser() user: User,
    @Query('date') date?: string,
  ): Promise<Paginated<Job>> {
    if (user.role === UserRole.USER) {
      return await this.jobsService.findJobsByTenant(
        query,
        user.tenant.id,
        date,
      );
    }
    return await this.jobsService.findAllJobs(query, date);
  }

  @Get(':id')
  async findOne(@Param('id') jobId: string) {
    return await this.jobsService.findJobDetail(jobId);
  }
}
