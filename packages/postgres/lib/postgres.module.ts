import { Module, ModuleWithProviders, InjectionToken, Injector, NgModuleBootstrap } from "@nger/core";
import { OrmModule, Driver, CURRENT_CONNECTION_OPTIONS } from '@nger/orm';
import { PostgresDriver } from "./driver";
import { PostgresConnectionOptions } from "./options";
export const CONNECTION_OPTION_TOKEN = new InjectionToken<PostgresConnectionOptions>(`CONNECTION_OPTION_TOKEN`)
@Module({
    providers: [{
        provide: Driver,
        useClass: PostgresDriver
    }, {
        provide: CURRENT_CONNECTION_OPTIONS,
        useFactory: (injector: Injector, options: PostgresConnectionOptions | InjectionToken<PostgresConnectionOptions>) => options instanceof InjectionToken ? injector.get(options) : options,
        deps: [Injector, CONNECTION_OPTION_TOKEN]
    }],
    imports: [
        OrmModule
    ]
})
export class PostgresOrmModule {
    static forFeature(options: PostgresConnectionOptions | InjectionToken<PostgresConnectionOptions>): ModuleWithProviders {
        return {
            ngModule: PostgresOrmModule,
            providers: [{
                provide: CONNECTION_OPTION_TOKEN,
                useValue: options
            }]
        }
    }

    static forRoot(options: PostgresConnectionOptions | InjectionToken<PostgresConnectionOptions>): ModuleWithProviders {
        return {
            ngModule: PostgresOrmModule,
            providers: [{
                provide: CONNECTION_OPTION_TOKEN,
                useValue: options
            }]
        }
    }
}