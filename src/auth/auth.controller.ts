import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LoginTenantDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { User as GetUser } from './decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginTenantDto: LoginTenantDto) {
    return this.authService.signIn(loginTenantDto);
  }

  @Get('refresh')
  @UseGuards(AuthGuard())
  refreshToken(@GetUser() user: User) {
    return this.authService.checkAuthentication(user);
  }

  @Put(':id')
  updateTenantProfile() {
    return 'xd';
  }
}
