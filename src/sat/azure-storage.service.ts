import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;

  constructor() {
    const accountName = 'accountName';
    //TODO replace for real SAS
    const sasToken = '?sr=c&si=sapn&sig=...';
    const blobUrl = `https://${accountName}.blob.core.windows.net${sasToken}`;

    this.blobServiceClient = new BlobServiceClient(blobUrl);
  }

  async upload(
    containerName: string,
    blobName: string,
    filePath: string,
  ): Promise<string> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const fileStream = fs.createReadStream(filePath);
    await blockBlobClient.uploadStream(fileStream);

    return blockBlobClient.url;
  }
}
