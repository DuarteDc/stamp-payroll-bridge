import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Paginate, Paginated, type PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { Tenant as GetTenant } from '../auth/decorators/tenant.decorator';
import { Tenant } from 'src/tenant/entities';
import { Job } from './entities';

@Controller('jobs')
@UseGuards(AuthGuard())
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/')
  async findAll(
    @Paginate() query: PaginateQuery,
    @GetTenant() tenant: Tenant,
  ): Promise<Paginated<Job>> {
    return await this.jobsService.findJobsByTenant(query, tenant.id);
  }

  @Get(':id')
  async findOne(@Param('id') jobId: string) {
    return await this.jobsService.findJobDetail(jobId);
  }
}
