import { Module, ModuleWithProviders, Config, InjectionToken, Injector } from "@nger/core";
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
    constructor(public config: Config) { }
    static forFeature(options: PostgresConnectionOptions | InjectionToken<PostgresConnectionOptions>): ModuleWithProviders {
        return {
            ngModule: PostgresOrmModule,
            providers: [{
                provide: ConnectionOptionsToken,
                useFactory: (injector: Injector) => options instanceof InjectionToken ? injector.get(options) : options,
                deps: [Injector]
            }]
        }
    }
}