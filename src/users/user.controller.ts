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
import { Tenant } from 'src/tenant/entities';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';
import { AuditAction } from 'src/audit/decorators/audit-action.decorator';
import { User } from './entities/user.entity';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { ChangePasswordDto } from './dto';

@Controller('users')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
  ) {}

  @AuditAction('view', 'users')
  @Get('/')
  async getAll(@GetUser() user: User, @Paginate() query: PaginateQuery) {
    return await this.userService.findAllUsers(query, user.id);
  }

  @AuditAction('view', 'detail')
  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  @AuditAction('create', 'user')
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

  @AuditAction('update', 'user')
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    let tenant: Tenant | undefined;
    const currentUser = await this.userService.findOne(id);

    if (!currentUser) {
      throw new BadRequestException(
        'El usuario que intentas actualizar no es valido',
      );
    }
    if (updateUserDto?.tenant) {
      tenant = await this.tenantService.findOne(updateUserDto.tenant);
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
      tenant ?? currentUser.tenant,
    );
  }

  @AuditAction('delete', 'user')
  @Patch('disable/:id')
  async disableUser(@Param('id') id: string) {
    return await this.userService.changeUserStatus(id, {
      status: CommonEntityStatus.FALSE,
    });
  }

  @Patch('change-password/:id')
  @AuditAction('update', 'user password')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changeUserPassword(id, changePasswordDto);
  }

  @Get('/profile')
  async updateProfileData(@GetUser() user: User) {
    return await new Promise((resolve) => resolve(user));
  }
}
