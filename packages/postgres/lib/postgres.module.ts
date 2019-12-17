import { Module, ModuleWithProviders } from "@nger/core";
import { OrmCoreModule, Driver, ConnectionOptionsToken } from '@nger/orm.core';
import { PostgresDriver } from "./driver";
import { PostgresConnectionOptions } from "./options";
@Module({
    providers: [{
        provide: Driver,
        useClass: PostgresDriver
    }],
    imports: [
        OrmCoreModule
    ],
    exports: [
        Driver
    ]
})
export class PostgresOrmModule {
    static forFeature(options: PostgresConnectionOptions): ModuleWithProviders {
        return {
            ngModule: PostgresOrmModule,
            providers: [{
                provide: ConnectionOptionsToken,
                useValue: options
            }]
        }
    }
}