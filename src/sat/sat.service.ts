import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import * as fs from 'fs';

import { envs } from 'src/config';

@Injectable()
export class SatService {
  private readonly keyPass = 'duarteBv17';

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
}
