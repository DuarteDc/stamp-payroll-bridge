import { Tenant } from '../tenant/entities';
import { setSeederFactory } from 'typeorm-extension';
import { hashSync } from 'bcrypt';
export const TenantFactory = setSeederFactory(Tenant, (faker) => {
  const tenant = new Tenant();

  tenant.username = faker.internet.userName();
  tenant.password = hashSync('password', 10);
  tenant.name = faker.person.fullName();

  tenant.status = '1';

  return tenant;
});
