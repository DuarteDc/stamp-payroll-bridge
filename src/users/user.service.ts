import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: {
          username,
        },
        relations: ['tenant'],
      });
    } catch (error) {
      return null;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['tenant'],
      });
    } catch (error) {
      return null;
    }
  }
}
