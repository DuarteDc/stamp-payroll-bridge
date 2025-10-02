import { BlobConfig } from '../sat/entities';
import { setSeederFactory } from 'typeorm-extension';

export const BlobConfigFactory = setSeederFactory(BlobConfig, (faker) => {
  const blobConfig = new BlobConfig();
  blobConfig.sasToken = faker.string.alphanumeric({
    length: { min: 30, max: 38 },
  });

  blobConfig.containerName = faker.string.alphanumeric({
    length: { min: 8, max: 10 },
  });
  blobConfig.status = '1';

  return blobConfig;
});
