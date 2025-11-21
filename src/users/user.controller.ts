import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { TenantService } from 'src/tenant/tenant.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
  ) {}

  @Get('/')
  async getAll(@Paginate() query: PaginateQuery) {
    return await this.userService.findAllUsers(query);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Post('/')
  async save(@Body() createUserDto: CreateUserDto) {
    const tenant = await this.tenantService.findOne(createUserDto.tenant);
    if (!tenant) {
      throw new BadRequestException(
        'La entidad a la que intentas asignar al usuario no es valida',
      );
    }

    const username = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (username) {
      throw new UnprocessableEntityException('El username ya ha sido usado');
    }

    return await this.userService.createUser(createUserDto, tenant);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const currentUser = await this.userService.findOne(id);

    if (!currentUser) {
      throw new BadRequestException(
        'El usuario que intentas actualizar no es valido',
      );
    }
    if (updateUserDto?.tenant) {
      const tenant = await this.tenantService.findOne(updateUserDto.tenant);
      if (!tenant) {
        throw new BadRequestException(
          'La entidad a la que intentas asignar al usuario no es valida',
        );
      }
    }

    if (updateUserDto?.username) {
      const username = await this.userService.findByUsername(
        updateUserDto.username,
      );
      if (username && username.id !== id) {
        throw new UnprocessableEntityException('El username ya ha sido usado');
      }
    }
    return await this.userService.updateUser(
      id,
      updateUserDto,
      currentUser.tenant,
    );
  }
}
