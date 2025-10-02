import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Tenant } from '../tenant/entities';
import { BlobConfig, Certificate } from '../sat/entities';

export class MainSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const tenantFactory = factoryManager.get(Tenant);
    const tenants = await tenantFactory.saveMany(10);
    const certificateFactory = factoryManager.get(Certificate);
    const blobConfigFactory = factoryManager.get(BlobConfig);

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

    const blobConfig = await Promise.all(
      Array(10)
        .fill('')
        .map(async () => {
          const blobConfig = await blobConfigFactory.make({
            tenant: faker.helpers.arrayElement(tenants),
          });
          return blobConfig;
        }),
    );

    const certificateRepo = datasource.getRepository(Certificate);
    const blobConfigRepo = datasource.getRepository(BlobConfig);
    await certificateRepo.save(certificates);
    await blobConfigRepo.save(blobConfig);
  }
}
