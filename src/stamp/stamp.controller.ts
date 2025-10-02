import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  HttpCode,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JobsService } from 'src/jobs/jobs.service';

@Controller('stamp')
export class StampController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  create(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // const job = await this.jobsService.createDefaultJob(params.id, file.path);
    return {
      message: `Processing started with ID: q231231oejqwisfjw9ij`,
    };
  }

  @Get(':id/tenant/:tenantId')
  findOne(@Param('id') id: string, @Param('tenantId') tenantId: string) {
    return this.jobsService.findJob(id, tenantId);
  }
}
