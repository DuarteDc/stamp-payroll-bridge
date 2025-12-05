import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  HttpCode,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditAction } from 'src/audit/decorators/audit-action.decorator';

import { JobsService } from 'src/jobs/jobs.service';

interface Parmas {
  rfc: string;
}
@Controller('stamp')
export class StampController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('upload/:rfc')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  @AuditAction('create', 'register new stamp')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: Parmas,
  ) {
    const job = await this.jobsService.createDefaultJob(params.rfc, file.path);
    return {
      message: `Processing started with ID: ${job.id}`,
    };
  }

  @Get(':id/tenant/:tenantId')
  findOne(@Param('id') id: string, @Param('tenantId') tenantId: string) {
    return this.jobsService.findJob(id, tenantId);
  }

  @Post('cancel/:rfc')
  @UseInterceptors(FileInterceptor('file'))
  @AuditAction('update', 'Stamp cancellation record')
  async cancel(
    @UploadedFile() file: Express.Multer.File,
    @Param('rfc') rfc: string,
  ) {
    if (!file) {
      throw new BadRequestException('Por favor proporciona un archivo');
    }

    return this.jobsService.startCancelProcess(rfc, file.path);
  }
}
