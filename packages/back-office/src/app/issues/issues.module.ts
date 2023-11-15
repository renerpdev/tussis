import { Module } from '@nestjs/common'
import { MedsModule } from '../meds/meds.module'
import { SymptomsModule } from '../symptoms/symptoms.module'
import { IssuesController } from './issues.controller'
import { IssuesService } from './issues.service'

@Module({
  imports: [SymptomsModule, MedsModule],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService, SymptomsModule, MedsModule],
})
export class IssuesModule {}
