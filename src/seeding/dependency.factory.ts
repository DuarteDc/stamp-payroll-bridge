import { Dependency } from 'src/dependency/entities/dependency.entity';
import { setSeederFactory } from 'typeorm-extension';

export const DependencyFactory = setSeederFactory(Dependency, (faker) => {
  const dependency = new Dependency();

  dependency.name = faker.company.name();
  dependency.abbreviation = faker.company.suffix();
  dependency.rfc = faker.helpers.arrayElement([
    'SSP190501626',
    'SGO1301036U0A',
    'SPF130103BF7',
  ]);
  dependency.status = '1';
});
