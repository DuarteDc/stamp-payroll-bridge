import { Tenant } from '../tenant/entities';
import { setSeederFactory } from 'typeorm-extension';
export const TenantFactory = setSeederFactory(Tenant, (faker) => {
  const tenant = new Tenant();
  tenant.rfc = faker.helpers.arrayElement([
    'SSP190501626',
    'SGO1301036U0A',
    'SPF130103BF7',
  ]);
  tenant.name = faker.person.fullName();

  tenant.status = '1';

  return tenant;
});
