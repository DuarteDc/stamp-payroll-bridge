import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { envs } from '../config/envs';
import { MainSeeder } from './main.seeder';
import { Tenant } from '../tenant/entities';
import { Certificate, BlobConfig } from '../sat/entities';
import { Job, JobEvent } from '../jobs/entities';
import { CertificateFactory } from './certificate.factory';
import { BlobConfigFactory } from './blob-config.factory';
import { WorkflowLog } from '../workflow/entities/workflow-log.entity';
import { UserFactory } from './user.factory';
import { User } from '../users/entities/user.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { UserSession } from '../auth/entities/user-session.entity';

void (async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'oracle',
    host: envs.dbHost,
    port: envs.dbPort,
    username: envs.dbUsername,
    schema: envs.dbSchema,
    serviceName: envs.dbSid,
    password: envs.dbPassword,
    //entities: [__dirname + '/**/*.entity{.ts,.js}'],
    entities: [
      Tenant,
      Certificate,
      Job,
      JobEvent,
      BlobConfig,
      WorkflowLog,
      User,
      AuditLog,
      UserSession,
    ],
    synchronize: true,
    dropSchema: true,
    seeds: [MainSeeder],
    factories: [UserFactory, CertificateFactory, BlobConfigFactory],
  };

  const datasource = new DataSource(options);
  await datasource.initialize();
  await runSeeders(datasource);
  console.log('Seeding successfully!!!!!');
  process.exit();
})();
