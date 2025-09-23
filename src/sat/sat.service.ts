import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import * as fs from 'fs';

import { envs } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, JobEvent } from 'src/jobs/entities';
import { Repository } from 'typeorm';
import { JobActions } from 'src/common/jobs/constants/job-action.constant';

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
  ) {}

  async createClient() {
    const client = await soap.createClientAsync(envs.satReceptionWsdl);
    client.setSecurity(
      new soap.WSSecurityCert(
        fs.readFileSync('duce010817ft5.cer'),
        fs.readFileSync('private.key'),
        this.keyPass,
      ),
    );
    return client;
  }
  sendPackageToSat(rfc: string, uriBlob: string) {
    const idPaquete = 'PKG' + Math.floor(Math.random() * 1000000);
    this.packagesMap.set(idPaquete, {
      status: 1,
      uriBlob,
      response: `https://fake-blob/${idPaquete}/resultado.zip`,
    });
    return {
      IdPaquete: idPaquete,
      Respuesta: `Archivo recibido para RFC ${rfc}`,
      CodRespuesta: 200,
    };
  }
  async consultarEstado(idPaquete: string) {
    const currentPackage = this.packagesMap.get(idPaquete);

    if (!currentPackage) {
      return {
        EstadoPaquete: 4, // No encontrado
        RespuestaServicio: 'Elemento no encontrado',
        BlobUriRespuesta: '',
      };
    }

    const job = await this.JobRepository.findOneBy({
      externalReference: idPaquete,
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
    if (currentPackage.status < 3) {
      currentPackage.status++;
    }

    return {
      EstadoPaquete: currentPackage.status,
      RespuestaServicio: 'Elemento encontrado',
      BlobUriRespuesta:
        currentPackage.status === 3 ? currentPackage.response : '',
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
