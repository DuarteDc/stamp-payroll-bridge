import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StampService } from './stamp.service';
import { CreateStampDto } from './dto/create-stamp.dto';
import { UpdateStampDto } from './dto/update-stamp.dto';

@Controller('stamp')
export class StampController {
  constructor(private readonly stampService: StampService) {}

  @Post()
  create(@Body() createStampDto: CreateStampDto) {
    return this.stampService.create(createStampDto);
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
