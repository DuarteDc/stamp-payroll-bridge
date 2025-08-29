import { Module } from '@nestjs/common';
import { StampService } from './stamp.service';
import { StampController } from './stamp.controller';
import { UnzipModule } from 'src/unzip/unzip.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SAT_SERVICE } from 'src/config';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  controllers: [StampController],
  providers: [StampService],
  imports: [
    UnzipModule,
    JobsModule,
    ClientsModule.register([
      {
        name: SAT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.SAT_MICROSERVICE_HOST || 'localhost',
          port: process.env.SAT_MICROSERVICE_PORT
            ? parseInt(process.env.SAT_MICROSERVICE_PORT, 10)
            : 4000,
        },
      },
    ]),
  ],
})
export class StampModule {}
