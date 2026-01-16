import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { Tenant } from 'src/tenant/entities';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto, ChangeUserStatusDto } from './dto';
import { HashService } from 'src/auth/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
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

  async findAllUsers(query: PaginateQuery, userId: string) {
    return paginate(query, this.userRepository, {
      sortableColumns: ['name', 'id', 'status'],
      nullSort: 'first',
      searchableColumns: ['name', 'username', 'role'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['tenant'],
      defaultLimit: 10,
      where: {
        id: Not(userId),
      },
    });
  }

  async createUser(createUserDto: CreateUserDto, tenant: Tenant) {
    const hashedPassword = this.hashService.getHashPassword(
      createUserDto.password,
    );
    createUserDto.password = hashedPassword;
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

  async changeUserStatus(id: string, { status }: ChangeUserStatusDto) {
    const user = await this.userRepository.update(id, { status });
    console.log(user);
    if (!user.affected)
      throw new UnprocessableEntityException(
        'Parece que hubo un error al actualizar el usuario',
      );
    return await this.findOne(id);
  }

  async changeUserPassword(
    id: string,
    { password, confirmPassword }: ChangePasswordDto,
  ) {
    if (password !== confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');
    const hashedPassword = this.hashService.getHashPassword(password);
    const user = await this.userRepository.update(id, {
      password: hashedPassword,
    });
    if (!user.affected)
      throw new UnprocessableEntityException(
        'Parece que hubo un error al actualizar la contraseña del usuario',
      );
    return await this.findOne(id);
  }
}
