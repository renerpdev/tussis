import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FirestoreModule } from './../firestore/firestore.module';
import { IssuesModule } from './issues/issues.module';
import { SymptomsModule } from './symptoms/symptoms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),
    SymptomsModule,
    IssuesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
