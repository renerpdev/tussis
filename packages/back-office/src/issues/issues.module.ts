import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { SymptomsService } from '../symptoms/symptoms.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, SymptomsService],
})
export class IssuesModule {}
