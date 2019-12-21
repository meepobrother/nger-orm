import { Module, ModuleWithProviders, Config, InjectionToken, Injector } from "@nger/core";
import { OrmModule, Driver, ConnectionOptionsToken } from '@nger/orm';
import { PostgresDriver } from "./driver";
import { PostgresConnectionOptions } from "./options";
export const POSTGRES_OPTIONS = new InjectionToken(`@nger/orm.postgres POSTGRES_OPTIONS`)
@Module({
    providers: [{
        provide: Driver,
        useClass: PostgresDriver
    }, {
        provide: ConnectionOptionsToken,
        useFactory: (injector: Injector, options: PostgresConnectionOptions | InjectionToken<PostgresConnectionOptions>) => options instanceof InjectionToken ? injector.get(options) : options,
        deps: [Injector, POSTGRES_OPTIONS]
    }],
    imports: [
        OrmModule
    ]
})
export class PostgresOrmModule {
    constructor(public config: Config) { }
    static forFeature(options: PostgresConnectionOptions | InjectionToken<PostgresConnectionOptions>): ModuleWithProviders {
        return {
            ngModule: PostgresOrmModule,
            providers: [{
                provide: POSTGRES_OPTIONS,
                useValue: options
            }]
        }
    }
}