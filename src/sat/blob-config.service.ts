import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlobConfig } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';
import { CreateSasDto } from './entities/dtos/create-sas.dto';
import { Tenant } from 'src/tenant/entities';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlobConfigService {
  constructor(
    @InjectRepository(BlobConfig)
    private readonly blobConfigRepository: Repository<BlobConfig>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async getActiveSAS() {
    return await this.blobConfigRepository.find({
      where: {
        status: '1',
      },
      relations: ['tenant'],
      order: {
        tenant: {
          name: {
            direction: 'ASC',
          },
        },
      },
    });
  }

  async createSas(sasId: string, createSasDto: CreateSasDto, user: User) {
    const sas = await this.blobConfigRepository.findOne({
      where: {
        id: sasId,
      },
      relations: ['tenant'],
    });

    const tenant = await this.tenantRepository.findOne({
      where: { id: sas?.tenant.id },
    });
    if (!tenant) {
      throw new NotFoundException('La entidad no existe o no es valida');
    }

    await this.blobConfigRepository.update(
      {
        tenant: {
          id: tenant.id,
        },
      },
      {
        status: CommonEntityStatus.FALSE,
      },
    );

    return this.blobConfigRepository.save({
      containerName: createSasDto.containerName,
      sasToken: createSasDto.sas,
      tenant,
      user,
    });
  }

  async getHistoryOfSas(tenantId: string) {
    return await this.blobConfigRepository.find({
      where: {
        tenant: {
          id: tenantId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });
  }
}
