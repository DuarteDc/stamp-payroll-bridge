import { User } from '../../users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
