import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpCode,
} from '@nestjs/common';
import { StampService } from './stamp.service';
import { UpdateStampDto } from './dto/update-stamp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UnzipService } from 'src/unzip/unzip/unzip.service';

@Controller('stamp')
export class StampController {
  constructor(
    private readonly stampService: StampService,
    private readonly unzipService: UnzipService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(202)
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/zip' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const outputPath = `./uploads/${new Date().getTime()}-${file.originalname}`;

    this.unzipService.unzipFile(file, outputPath);
    return { message: 'File is being processed' };
  }

  @Get()
  findAll() {
    return this.stampService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stampService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStampDto: UpdateStampDto) {
    return this.stampService.update(+id, updateStampDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stampService.remove(+id);
  }
}
