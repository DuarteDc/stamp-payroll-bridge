import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import AdmZip from 'adm-zip';

@Injectable()
export class UnzipService {
  constructor() {}

  unzipFile(file: Express.Multer.File, outputPath: string) {
    if (fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const zip = new AdmZip(file.buffer);
    zip.extractAllTo(outputPath, true);
    console.log(`Unzipped to ${outputPath}`);
  }
}
