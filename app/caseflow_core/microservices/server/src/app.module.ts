import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

//_____________________Custom Imports_____________________//
import { DmsModule } from './dms/dms.module';
import { CasesModule } from './cases/cases.module';
import { CaseHistoryModule } from './case_history/case_history.module';
import { CaseEventsModule } from './case_events/case_events.module';
import { EventTypesModule } from './event_types/event_types.module';

const keyCloakOptionsProvider =  {
  provide: 'keyCloakDataProvider',
  useFactory: (config: ConfigService) => {
    return {
      authServerUrl: "https://caseflow-idm.aot-technologies.com:8443/auth",
      realm: "caseflow",
      clientId: "case-flow-nest",
      secret: "Qhvu0sBg15UsiplYL5msFVqjzyOVaxRr"
    }
  },
  inject: [ ConfigService],
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DmsModule,
    CasesModule,
    KeycloakConnectModule.registerAsync(keyCloakOptionsProvider),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'caseflowdev.ccizdidwz3tj.ca-central-1.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: '0DhoxLWL5HlS27WjLkUL',
      database: 'caseflow_core',
      // synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['./src/migrations/*.ts'],
    }),
    CaseHistoryModule,
    CaseEventsModule,
    EventTypesModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    //  },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],

})
export class AppModule {}
