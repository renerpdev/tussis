import { DynamicModule, FactoryProvider, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { FirebaseAuthProvider } from './auth.providers'
import { FirebaseAuthStrategy } from './firebase-auth.strategy'

type AuthModuleOptions = {
  imports: DynamicModule['imports']
  useFactory: (...args: unknown[]) => any
  inject: FactoryProvider['inject']
}

@Module({
  imports: [PassportModule],
  providers: [FirebaseAuthStrategy],
  exports: [],
})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: FirebaseAuthProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      global: true,
      module: AuthModule,
      imports: options.imports,
      providers: [optionsProvider],
      exports: [],
    }
  }
}
