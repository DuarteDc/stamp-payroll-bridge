import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, Paginated, type PaginateQuery } from 'nestjs-paginate';

import { JobsService } from './jobs.service';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { Job } from './entities';
import { User } from 'src/users/entities/user.entity';

@Controller('jobs')
@UseGuards(AuthGuard())
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/')
  async findAll(
    @Paginate() query: PaginateQuery,
    @GetUser() user: User,
  ): Promise<Paginated<Job>> {
    return await this.jobsService.findJobsByTenant(query, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') jobId: string) {
    return await this.jobsService.findJobDetail(jobId);
  }
}
