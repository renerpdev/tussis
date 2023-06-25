import { IssuesModule } from './../issues/issues.module';
import { Module } from '@nestjs/common';

import { SymptomsModule } from '../symptoms/symptoms.module';

@Module({
  imports: [SymptomsModule, IssuesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
