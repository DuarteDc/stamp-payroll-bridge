import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { BlobConfig } from 'src/sat/entities';
import { UpdateTenantDto } from './dtos';
import { CommonEntityStatus } from 'src/common/types/common-entity-status.type';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(BlobConfig)
    private readonly blobConfigRepository: Repository<BlobConfig>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.tenantRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleError(error);
    }
  }

  async save({ name, rfc, abbreviation, ...createTenantDto }: CreateTenantDto) {
    let tenant = await this.tenantRepository.findOneBy({
      rfc,
    });
    if (tenant) {
      throw new BadRequestException('EL RFC ya ha sido registrado');
    }
    tenant = await this.tenantRepository.save({
      name,
      rfc,
      abbreviation,
    });

    return this.blobConfigRepository.save({
      containerName: createTenantDto.containerName,
      sasToken: createTenantDto.sas,
      tenant,
    });
  }

  async findAll() {
    try {
      return await this.tenantRepository.find({ where: { status: '1' } });
    } catch (error) {
      this.handleError(error);
    }
  }

  async enableAndDisableTenant(id: string) {
    const tenant = await this.tenantRepository.findOneBy({ id });
    if (!tenant)
      throw new BadRequestException('La entidad no existe o no es valida');

    if (tenant.status === CommonEntityStatus.TRUE) {
      await this.tenantRepository.update(
        { id },
        { status: CommonEntityStatus.FALSE },
      );
    } else {
      await this.tenantRepository.update(
        { id },
        { status: CommonEntityStatus.TRUE },
      );
    }

    return tenant;
  }
  async updateTenant(id: string, updateTenantDto: UpdateTenantDto) {
    try {
      return await this.tenantRepository.update(
        { id },
        {
          ...updateTenantDto,
        },
      );
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
