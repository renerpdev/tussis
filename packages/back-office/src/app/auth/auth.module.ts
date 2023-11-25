import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { FirebaseAuthStrategy } from './firebase-auth.strategy'

@Module({
  imports: [PassportModule],
  providers: [FirebaseAuthStrategy],
  controllers: [],
  exports: [],
})
export class AuthModule {}
