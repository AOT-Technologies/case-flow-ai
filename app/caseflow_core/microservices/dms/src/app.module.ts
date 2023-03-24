import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {  ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect';
import { ConfigModule,ConfigService } from '@nestjs/config';

//_____________________Custom Imports_____________________//
import { DocumentsModule } from './documents/documents.module';
import { HelpersModule } from './helpers/helpers.module';
import { VersionsModule } from './versions/versions.module';
import {HttpModule} from  '@nestjs/axios'
import { APP_GUARD } from '@nestjs/core';

//keycloack settings
const keyCloakOptionsProvider =  {
  provide: 'keyCloakDataProvider',
  useFactory: (config: ConfigService) => {
    return {
      authServerUrl: config.get('KEYCLOCK_AUTH_URL'),
      realm: config.get('KEYCLOCK_REALM'),
      clientId: config.get('KEYCLOCK_CLIENT_ID'),
      secret: config.get('KEYCLOCK_SECRET'),
    }
  },
  inject: [ ConfigService],
};
@Module({
  imports: [HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocumentsModule,
    HelpersModule,
    KeycloakConnectModule.registerAsync(keyCloakOptionsProvider),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      type: 'postgres',

      host: config.get('POSTGRESQL_HOST') || 'caseflowdev.ccizdidwz3tj.ca-central-1.rds.amazonaws.com',
      port: parseInt(config.get('POSTGRESQL_PORT')) || 5432,
      database: config.get('POSTGRES_DATABASE') || 'caseflow_core',
      username: config.get('POSTGRES_DB_USERNAME') || 'postgres',
      password: config.get('POSTGRES_DB_PASSWORD') || '0DhoxLWL5HlS27WjLkUL',

      // synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['./src/migrations/*.ts'],
    }), }),
    VersionsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
     },
  ],

})
export class AppModule {}
