import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { Tenant } from 'src/tenant/entities';
import { UpdateUserDto } from './dto/update-user.dto';

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
        select: [
          'id',
          'name',
          'username',
          'role',
          'status',
          'createdAt',
          'updatedAt',
          'tenant',
        ],
      });
    } catch (error) {
      return null;
    }
  }

  async findAllUsers(query: PaginateQuery) {
    return paginate(query, this.userRepository, {
      sortableColumns: ['name', 'id', 'status'],
      nullSort: 'first',
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      select: [
        'id',
        'name',
        'username',
        'role',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async createUser(createUserDto: CreateUserDto, tenant: Tenant) {
    return await this.userRepository.save({ ...createUserDto, tenant });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, tenant: Tenant) {
    const user = await this.userRepository.update(id, {
      ...updateUserDto,
      tenant,
    });
    if (!user.affected)
      throw new UnprocessableEntityException(
        'Parece que hubo un error al actualizar el usuario',
      );
    return await this.findOne(id);
  }
}
