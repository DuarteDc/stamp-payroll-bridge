import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { envs } from '../config/envs';
import { MainSeeder } from './main.seeder';
import { Tenant } from '../tenant/entities';
import { Certificates } from '../sat/entities';
import { Job, JobEvent } from '../jobs/entities';
void (async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'oracle',
    host: envs.dbHost,
    port: envs.dbPort,
    username: envs.dbSchema,
    password: envs.dbPassword,
    //entities: [__dirname + '/**/*.entity{.ts,.js}'],
    entities: [Tenant, Certificates, Job, JobEvent],
    synchronize: true,
    seeds: [MainSeeder],
    factories: ['src/seeding/**/*.factory{.ts,.js}'],
  };

  const datasource = new DataSource(options);
  await datasource.initialize();
  await runSeeders(datasource);
})();
