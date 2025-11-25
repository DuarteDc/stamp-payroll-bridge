import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enable('trust proxy');

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'OPTIONS'],
  });
  await app.listen(envs.port);

  logger.log(`Application is running on port:${envs.port}`);
}
bootstrap();
