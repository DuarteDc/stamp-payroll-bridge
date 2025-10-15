import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import * as fs from 'fs';

import { envs } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, JobEvent } from 'src/jobs/entities';
import { Repository } from 'typeorm';
import { JobActions } from 'src/common/jobs/constants/job-action.constant';
import { AzureStorageService } from './azure-storage.service';
import { Tenant } from 'src/tenant/entities';

type Package = {
  status: number;
  uriBlob: string;
  response: string;
};

@Injectable()
export class SatService {
  private readonly keyPass = 'duarteBv17';
  private packagesMap = new Map<string, Package>();

  constructor(
    @InjectRepository(Job)
    private readonly JobRepository: Repository<Job>,
    @InjectRepository(JobEvent)
    private readonly JobEventRepository: Repository<JobEvent>,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  async createClient() {
    const client = await soap.createClientAsync(envs.satReceptionWsdl);
    client.setSecurity(
      new soap.WSSecurityCert(
        Buffer.from(fs.readFileSync('duce010817ft5.cer')).toString('base64'),
        fs.readFileSync('private.key'),
        this.keyPass,
      ),
    );
    return client;
  }

  async sendPackageToSat(tenat: Tenant, filePath: string) {
    console.log(tenat);
    // console.log(await this.createClient());

    // Call azure funtion to upload file zip
    // await this.azureStorageService.upload(
    //   tenat.blobConfig[0].containerId,
    //   tenat.blobConfig[0].sas_token,
    //   filePath,
    // );
    const idPaquete = 'PKG' + Math.floor(Math.random() * 1000000);
    this.packagesMap.set(idPaquete, {
      status: 1,
      uriBlob: filePath,
      response: `https://fake-blob/${idPaquete}/resultado.zip`,
    });
    return {
      IdPaquete: idPaquete,
      Respuesta: `Archivo recibido para RFC ${tenat.rfc}`,
      CodRespuesta: 200,
    };
  }
  async checkStatus(idPaquete: string) {
    const currentPackage = this.packagesMap.get(idPaquete);
    console.log(this.packagesMap);
    if (!currentPackage) {
      return {
        EstadoPaquete: 4, // No encontrado
        RespuestaServicio: 'Elemento no encontrado',
        BlobUriRespuesta: '',
      };
    }

    const job = await this.JobRepository.findOne({
      where: {
        externalReference: idPaquete,
      },
      relations: ['tenant'],
    });

    await this.JobEventRepository.save({
      job: job!,
      type: JobActions.CONSULTING_PACKAGE,
      payload: {
        id: job!.id,
        tenantId: job?.tenant.id,
        data: {
          EstadoPaquete: 4, // No encontrado
          RespuestaServicio: 'Consulta del paquete ante el sat',
          BlobUriRespuesta: '',
        },
      },
    });
    // Simulación: va cambiando de estado
    if (currentPackage.status < 10) {
      currentPackage.status++;
    }

    return {
      EstadoPaquete: currentPackage.status,
      RespuestaServicio: 'Elemento encontrado',
      BlobUriRespuesta:
        currentPackage.status === 10 ? currentPackage.response : '',
    };
  }

  procesarCancelacion(rfc: string) {
    const urlSalida = `https://fake-blob/cancelaciones/${Date.now()}.zip`;

    return {
      UrlSalida: urlSalida,
      Respuesta: `Cancelación procesada para RFC ${rfc}`,
      CodRespuesta: 200,
    };
  }
}
