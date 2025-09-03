import { Tenant } from '../tenant/entities';
import { setSeederFactory } from 'typeorm-extension';

export const TenantFactory = setSeederFactory(Tenant, (faker) => {
  const tenant = new Tenant();

  tenant.name = faker.person.fullName();
  tenant.rfc = faker.string.alphanumeric();
  tenant.status = '1';

  return tenant;
});
