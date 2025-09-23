import { Module } from '@nestjs/common';
import { SatService } from './sat.service';

@Module({
  providers: [SatService],
  exports: [SatService],
})
export class SatModule {}
