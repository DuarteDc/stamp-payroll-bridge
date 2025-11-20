import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService } from './hash.service';

import { LoginTenantDto } from './dto';
import { TokenService } from './token.service';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn({ username, password }: LoginTenantDto) {
    const user = await this.userService.findByUsername(username);
    if (!user || !this.hashService.verifyPassword(password, user.password))
      throw new BadRequestException('El usuario o contraseña no son validos');

    const { password: __, ...tenantWithoutPassword } = user;
    return {
      ...tenantWithoutPassword,
      accessToken: await this.tokenService.sign({ id: user.id }),
    };
  }

  async checkAuthentication(user: User) {
    const { password: __, ...tenantWithoutPassword } = user;
    return {
      ...tenantWithoutPassword,
      accessToken: await this.tokenService.sign({ id: user.id }),
    };
  }
}
