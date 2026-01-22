import { DataSource } from 'typeorm';
import { oracleTypeOrmConfig } from './typeorm.config';

export const OracleConfigDatasource = new DataSource({
  ...oracleTypeOrmConfig,
  migrations: ['src/datasource/migrations/*.ts'],
});
