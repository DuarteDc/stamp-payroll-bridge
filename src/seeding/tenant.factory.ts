import { DEFAUTL_TENANTS } from '../tenant/constants/default-tenants.constants';
import { Tenant } from '../tenant/entities';
export const TenantFactory = () => {
  const newTenants: Tenant[] = [];

  for (const tenant of DEFAUTL_TENANTS) {
    const newTenant = new Tenant();
    newTenant.name = tenant.name;
    newTenant.abbreviation = tenant.abbreviation;
    newTenant.rfc = tenant.rfc;
    newTenant.status = '1';
    newTenants.push(newTenant);
  }
  return newTenants;
};
