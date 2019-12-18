
import { Module, ModuleWithProviders } from '@nger/core';
import { PgGraphql } from './pg_graphql';
import { PostgresOrmModule, PostgresConnectionOptions } from '@nger/orm.postgres';
import { ConnectionOptionsToken } from '@nger/orm.core';

@Module({
    imports: [
        PostgresOrmModule
    ],
    providers: [
        PgGraphql,
    ],
    exports: [
        PgGraphql
    ]
})
export class PgGraphqlModule {
    static forFeature(options: PostgresConnectionOptions): ModuleWithProviders {
        return {
            ngModule: PgGraphqlModule,
            providers: [{
                provide: ConnectionOptionsToken,
                useValue: options
            }]
        }
    }
}