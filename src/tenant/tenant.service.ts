import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.tenantRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.tenantRepository.findOne({
        where: {
          username,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.log(error);
    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException('Internal server error');
  }
}
