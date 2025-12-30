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

export interface AuditActionOptions {
  action?: AuditActionType | null;
  description?: string;
  path?: string;
}

export const AuditAction = (
  action?: AuditActionType | null,
  description?: string,
  path?: string,
) => {
  const metadata: AuditActionOptions = {
    action: action ?? null,
    description: description ?? undefined,
    path: path ?? undefined,
  };

  return SetMetadata(AUDIT_ACTION, metadata);
};
