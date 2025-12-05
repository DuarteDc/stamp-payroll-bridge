import { readFileSync } from 'fs';

import { WSSecurityCert } from 'soap';

export class WSSecurity extends WSSecurityCert {
  constructor() {
    const privateKey = readFileSync('./src/certs/llave.pem');
    const publicCert = readFileSync('./src/certs/certificado.pem');
    super(privateKey, publicCert, '');
  }
}
