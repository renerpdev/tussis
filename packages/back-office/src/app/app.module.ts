import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FirestoreModule } from '../firestore/firestore.module'
import { AuthModule } from './auth/auth.module'
import { IssuesModule } from './issues/issues.module'

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
        ignoreUndefinedProperties: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),
    IssuesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
