import { Module, ModuleWithProviders } from "@nger/core";
import { ConnectionOptionsToken, ConnectionOptions } from "./token";
import { Connection } from "./connection";
@Module({
    providers: [Connection],
    exports: [Connection]
})
export class OrmModule {
    static forFeature(options: ConnectionOptions): ModuleWithProviders {
        return {
            ngModule: OrmModule,
            providers: [{
                provide: ConnectionOptionsToken,
                useValue: options
            }]
        }
    }
}
