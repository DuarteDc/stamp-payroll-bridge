import { Injectable } from '@nestjs/common';
import { CreateStampDto } from './dto/create-stamp.dto';
import { UpdateStampDto } from './dto/update-stamp.dto';

@Injectable()
export class StampService {
  create() {
    return 'This action adds a new stamp';
  }

  findAll() {
    return `This action returns all stamp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stamp`;
  }

  update(id: number) {
    return `This action updates a #${id} stamp`;
  }

  remove(id: number) {
    return `This action removes a #${id} stamp`;
  }
}
