import { Module } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedsController } from './meds.controller';

@Module({
  controllers: [MedsController],
  providers: [MedsService],
  exports: [MedsService],
})
export class MedsModule {}
