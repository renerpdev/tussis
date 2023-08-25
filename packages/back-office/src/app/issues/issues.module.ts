import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { SymptomsModule } from '../symptoms/symptoms.module';

@Module({
  imports: [SymptomsModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
