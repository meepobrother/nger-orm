import { Module, ModuleWithProviders } from "@nger/core";
import { ConnectionOptionsToken, ConnectionOptions } from "./token";
import { Connection } from "./connection";

@Module({
    providers: [Connection],
    exports: [Connection]
})
export class OrmCoreModule {
    static forFeature(options: ConnectionOptions): ModuleWithProviders {
        return {
            ngModule: OrmCoreModule,
            providers: [{
                provide: ConnectionOptionsToken,
                useValue: options
            }]
        }
    }
}
