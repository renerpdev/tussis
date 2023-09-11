import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { SymptomsModule } from '../symptoms/symptoms.module';
import { MedsModule } from '../meds/meds.module';

@Module({
  imports: [SymptomsModule, MedsModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
