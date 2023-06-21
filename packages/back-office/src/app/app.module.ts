import { Module } from '@nestjs/common';

import { SymptomsModule } from '../symptoms/symptoms.module';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [SymptomsModule, IssuesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
