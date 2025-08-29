import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StampModule } from './stamp/stamp.module';
import { UnzipModule } from './unzip/unzip.module';

@Module({
  imports: [StampModule, UnzipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
