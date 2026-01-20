import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async save(userSession: Omit<UserSession, 'id' | 'createdAt'>) {
    return await this.userSessionRepository.save(userSession);
  }

  async findSession(refreshTokenId: string) {
    return await this.userSessionRepository.findOne({
      where: {
        refreshTokenId,
        revokedAt: IsNull(),
      },
      relations: ['user'],
    });
  }

  findActiveByUser(userId: string, sessionId: string) {
    return this.userSessionRepository.findOne({
      where: {
        user: { id: userId },
        refreshTokenId: sessionId,
        revokedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  findAllActiveByUser(userId: string) {
    return this.userSessionRepository.find({
      where: {
        user: { id: userId },
        revokedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }
  touch(id: string) {
    return this.userSessionRepository.update(id, {
      lastActivityAt: new Date(),
    });
  }

  revoke(id: string) {
    return this.userSessionRepository.update(id, {
      revokedAt: new Date(),
    });
  }

  update(id: string, data: Partial<UserSession>) {
    return this.userSessionRepository.update(id, data);
  }
}
