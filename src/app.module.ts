import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StampModule } from './stamp/stamp.module';

@Module({
  imports: [StampModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
