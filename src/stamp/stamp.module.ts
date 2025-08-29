import { Module } from '@nestjs/common';
import { StampService } from './stamp.service';
import { StampController } from './stamp.controller';
import { UnzipModule } from 'src/unzip/unzip.module';

@Module({
  controllers: [StampController],
  providers: [StampService],
  imports: [UnzipModule],
})
export class StampModule {}
