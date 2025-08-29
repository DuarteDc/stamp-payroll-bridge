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

import { firstValueFrom } from 'rxjs';
import { JobsService } from 'src/jobs/jobs.service';
@Controller('stamp')
export class StampController {
  constructor(
    @Inject(SAT_SERVICE) private readonly clientSatService: ClientProxy,
    private readonly stampService: StampService,
    private readonly unzipService: UnzipService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/zip' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const job = this.jobsService.create({});

    const processId = await firstValueFrom(
      this.clientSatService.send({ cmd: 'process_file' }, { data: file }),
    );
    console.log({ processId });
    return {
      message: `Processing started with ID: ${job.id}`,
    };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stampService.findOne(+id);
  }
}
