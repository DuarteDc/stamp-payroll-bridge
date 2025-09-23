import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Tenant } from '../tenant/entities';
import { Certificate } from '../sat/entities';

export class MainSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const tenantFactory = factoryManager.get(Tenant);
    const tenants = await tenantFactory.saveMany(10);

    const certificateFactory = factoryManager.get(Certificate);

    const certificates = await Promise.all(
      Array(10)
        .fill('')
        .map(async () => {
          const certificate = await certificateFactory.make({
            tenant: faker.helpers.arrayElement(tenants),
          });
          return certificate;
        }),
    );

    const certificateRepo = datasource.getRepository(Certificate);
    await certificateRepo.save(certificates);
  }
}
