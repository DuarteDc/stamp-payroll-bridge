import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { StampService } from './stamp.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { JobsService } from 'src/jobs/jobs.service';

interface Parmas {
  id: string;
}
@Controller('stamp')
export class StampController {
  constructor(
    private readonly stampService: StampService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  async create(@Param() params: Parmas) {
    const job = await this.jobsService.createDefaultJob(params.id);
    return {
      message: `Processing started with ID: ${job.id}`,
    };
  }

  @Get(':id/tenant/:tenantId')
  findOne(@Param('id') id: string, @Param('tenantId') tenantId: string) {
    return this.jobsService.findJob(id, tenantId);
  }
}
