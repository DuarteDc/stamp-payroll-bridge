import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Tenant } from '../tenant/entities';
import { BlobConfig, Certificate } from '../sat/entities';
import { TenantFactory } from './tenant.factory';
import { User } from '../users/entities/user.entity';

export class MainSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const newTenants = TenantFactory();
    const tenantRepo = datasource.getRepository(Tenant);
    const tenants = await tenantRepo.save(newTenants);

    const userFactory = factoryManager.get(User);

    const certificateFactory = factoryManager.get(Certificate);
    const blobConfigFactory = factoryManager.get(BlobConfig);

    const users = await Promise.all(
      Array(10)
        .fill('')
        .map(async () => {
          const user = await userFactory.make({
            tenant: faker.helpers.arrayElement(tenants),
          });
          return user;
        }),
    );

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
    const userConfigRepo = datasource.getRepository(User);
    await Promise.all([
      await userConfigRepo.save(users),
      await certificateRepo.save(certificates),
      await blobConfigRepo.save(blobConfig),
    ]);
  }
}
