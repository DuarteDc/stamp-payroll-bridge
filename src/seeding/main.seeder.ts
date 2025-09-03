import { Tenant } from '../tenant/entities';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    _datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const tenantFactory = factoryManager.get(Tenant);
    await tenantFactory.saveMany(5);
  }
}
