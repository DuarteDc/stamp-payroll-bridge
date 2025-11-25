// audit/decorators/audit-action.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const AUDIT_ACTION = 'audit_action';

export type AuditActionType =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'custom';

export const AuditAction = (
  action: AuditActionType | null = null,
  desciption?: string,
) =>
  SetMetadata(AUDIT_ACTION, desciption ? `${action} - ${desciption}` : action);
