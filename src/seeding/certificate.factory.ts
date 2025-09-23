import { setSeederFactory } from 'typeorm-extension';
import { Certificate } from './../sat/entities';

export const CertificateFactory = setSeederFactory(Certificate, (faker) => {
  const certificate = new Certificate();

  certificate.type = faker.helpers.arrayElement(['CSD', 'FIEL']);
  certificate.serialNumber = faker.number.int({ min: 500 }).toString();
  certificate.file = faker.string.alphanumeric(100);
  certificate.status = '1';
  certificate.expriedAt = faker.date.future({ years: 1 });

  return certificate;
});
