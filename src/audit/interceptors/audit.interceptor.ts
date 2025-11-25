/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuditService } from '../audit.service';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const action = this.reflector.get<string>(
      'audit_action',
      context.getHandler(),
    );

    if (action) {
      const req = context.switchToHttp().getRequest(); // Ya tiene req.user tipado

      await this.auditService.create({
        userId: req.user?.id || '',
        ip: req.ip ?? '',
        userAgent: req.headers['user-agent'] ?? '',
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        action,
      });
    }

    return next.handle();
  }
}
