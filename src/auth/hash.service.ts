import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class HashService {
  getHashPassword(password: string) {
    return hashSync(password, 10);
  }

  verifyPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
