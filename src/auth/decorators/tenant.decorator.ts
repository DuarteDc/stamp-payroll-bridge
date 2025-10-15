import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Tenant as TenentEntity } from 'src/tenant/entities';

export const Tenant = createParamDecorator(
  (__: unknown, ctx: ExecutionContext) => {
    const { user }: { user: TenentEntity } = ctx.switchToHttp().getRequest();
    if (!user || !user.status)
      throw new InternalServerErrorException(
        'User not found in request object',
      );
    return user;
  },
);
