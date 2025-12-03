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
import { sanitizedBody } from '../helpers/sanitized-body.helper';
import { AuditActionOptions } from '../decorators/audit-action.decorator';
import { resolveDynamicPath } from '../helpers/resolve-dynamic-paths.helper';

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
    const meta = this.reflector.get<AuditActionOptions>(
      'audit_action',
      context.getHandler(),
    );
    const action = meta?.description
      ? `${meta.action} - ${meta.description}`
      : (meta?.action ?? null);

    if (action) {
      const req = context.switchToHttp().getRequest();
      const customPath = meta?.path
        ? resolveDynamicPath(meta.path, req.params)
        : null;

      const body = sanitizedBody(req.body);
      await this.auditService.create({
        user: req.user,
        ip: req.ip ?? '',
        userAgent: req.headers['user-agent'] ?? '',
        path: customPath ?? req.originalUrl,
        method: req.method,
        body: body,
        action,
      });
    }

    return next.handle();
  }
}
