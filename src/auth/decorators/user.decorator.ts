import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { User as UserEntity } from 'src/users/entities/user.entity';

export const User = createParamDecorator(
  (__: unknown, ctx: ExecutionContext) => {
    const { user }: { user: UserEntity } = ctx.switchToHttp().getRequest();
    if (!user || !user.status)
      throw new InternalServerErrorException(
        'User not found in request object',
      );
    return user;
  },
);
