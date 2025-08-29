import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StampModule } from './stamp/stamp.module';
import { UnzipModule } from './unzip/unzip.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    StampModule,
    UnzipModule,
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1521,
      username: process.env.DB_USERNAME || 'system',
      password: process.env.DB_PASSWORD || 'MiPasswordSeguro',
      sid: process.env.DB_SID || 'XE',
      schema: process.env.DB_SCHEMA || 'DB_SCHEMA',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
