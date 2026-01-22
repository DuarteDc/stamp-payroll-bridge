import { AuditLog } from 'src/audit/entities/audit-log.entity';
import { UserSession } from 'src/auth/entities/user-session.entity';
import { envs } from 'src/config';
import { Job, JobEvent } from 'src/jobs/entities';
import { BlobConfig, Certificate } from 'src/sat/entities';
import { Tenant } from 'src/tenant/entities';
import { User } from 'src/users/entities/user.entity';
import { WorkflowLog } from 'src/workflow/entities/workflow-log.entity';
import { DataSourceOptions } from 'typeorm';
export const oracleTypeOrmConfig: DataSourceOptions = {
  type: 'oracle',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUsername,
  password: envs.dbPassword,
  schema: envs.dbSchema,
  serviceName: envs.dbSid,

  entities: [
    Job,
    JobEvent,
    Certificate,
    Tenant,
    BlobConfig,
    WorkflowLog,
    User,
    AuditLog,
    UserSession,
  ],

  synchronize: false,
};
