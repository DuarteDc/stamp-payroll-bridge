import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { StampService } from './stamp.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UnzipService } from 'src/unzip/unzip/unzip.service';
import { SAT_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

import { JobsService } from 'src/jobs/jobs.service';

interface Parmas {
  id: string;
}
@Controller('stamp')
export class StampController {
  constructor(
    @Inject(SAT_SERVICE) private readonly clientSatService: ClientProxy,
    private readonly stampService: StampService,
    private readonly unzipService: UnzipService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  async create(
    @Param() params: Parmas,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/zip' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const job = await this.jobsService.createDefaultJob(params.id);
    return {
      message: `Processing started with ID: ${job.id}`,
    };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stampService.findOne(+id);
  }
}
