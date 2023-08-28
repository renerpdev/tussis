import { Module, DynamicModule, FactoryProvider } from '@nestjs/common';
import { Firestore, Settings } from '@google-cloud/firestore';
import {
  FirestoreDatabaseProvider,
  FirestoreOptionsProvider,
  FirestoreCollectionProviders,
} from './firestore.providers';

type FirestoreModuleOptions = {
  imports: DynamicModule['imports'];
  useFactory: (...args: unknown[]) => Settings;
  inject: FactoryProvider['inject'];
};

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class FirestoreModule {
  static forRoot(options: FirestoreModuleOptions): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: FirestoreOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const dbProvider: FactoryProvider = {
      provide: FirestoreDatabaseProvider,
      useFactory: (config) => new Firestore(config),
      inject: [FirestoreOptionsProvider],
    };

    const collectionProviders: FactoryProvider[] =
      FirestoreCollectionProviders.map((providerName) => ({
        provide: providerName,
        useFactory: (db) => db.collection(providerName),
        inject: [FirestoreDatabaseProvider],
      }));

    return {
      global: true,
      module: FirestoreModule,
      imports: options.imports,
      providers: [optionsProvider, dbProvider, ...collectionProviders],
      exports: [dbProvider, ...collectionProviders],
    };
  }
}
