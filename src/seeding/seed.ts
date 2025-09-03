import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { envs } from '../config/envs';
void (async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'oracle',
    host: envs.dbHost,
    port: envs.dbPort,
    username: envs.dbSchema,
    password: envs.dbPassword,
    entities: [__dirname + '**/*.entity{.ts,.js}'],
    synchronize: true,
    seeds: ['src/seeding/**/*.seeder{.ts,.js}'],
    factories: ['src/seeding/**/*.factory{.ts,.js}'],
  };

  const datasource = new DataSource(options);
  await datasource.initialize();
  await runSeeders(datasource);
})();
