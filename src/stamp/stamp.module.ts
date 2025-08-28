import { Module } from '@nestjs/common';
import { StampService } from './stamp.service';
import { StampController } from './stamp.controller';

@Module({
  controllers: [StampController],
  providers: [StampService],
})
export class StampModule {}
