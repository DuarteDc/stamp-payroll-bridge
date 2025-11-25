/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuditService } from '../audit.service';
import { getRealIp } from '../helpers/get-real-ip.helper';
import { TokenService } from 'src/auth/token.service';
import { UserService } from 'src/users/user.service';
import { JWTPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(
    private readonly auditService: AuditService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async use(req: any, _res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const { id } = this.tokenService.verify(token) as JWTPayload;
        const user = await this.userService.findOne(id);

        req.user = user;
      } catch (error) {
        throw new UnauthorizedException('Invalid credentiasl');
      }
    }
    const ip = getRealIp(req);
    const userAgent = req.headers['user-agent'];
    const method = req.method;
    const path = req.originalUrl;
    const body = req.body;
    const user = req.user ? req.user : null;
    console.log(req.user);

    await this.auditService.create({
      ip,
      userAgent,
      method,
      path,
      body,
      user: user,
    });

    next();
  }
}
