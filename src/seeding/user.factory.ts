import { hashSync } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.firstName();
  user.username = faker.internet.userName();
  user.password = hashSync('password', 10);
  user.status = '1';

  return user;
});
