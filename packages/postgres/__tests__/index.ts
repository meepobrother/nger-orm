import { corePlatform, Module, OnModuleInit, Logger } from '@nger/core';
import {
    PostgresOrmModule
} from '../lib';
import { Connection } from '@nger/orm.core'

@Module({
    imports: [
        PostgresOrmModule.forFeature({
            name: 'default',
            uuidExtension: 'pgcrypto',
            entities: [],
            replication: {
                master: {
                    host: `193.112.55.191`,
                    port: 5432,
                    username: `magnus`,
                    password: `magnus`,
                    database: `zp`
                }
            }
        })
    ],
    providers: []
})
export class AppModule implements OnModuleInit {
    ngOnModuleInit() {
        console.log(`AppModule`)
    }
}
export class CoreLogger extends Logger {
    log(message: any, context?: string | undefined): void {
        throw new Error("Method not implemented.");
    }
    error(message: any, trace?: string | undefined, context?: string | undefined): void {
        throw new Error("Method not implemented.");
    }
    warn(message: any, context?: string | undefined): void {
        throw new Error("Method not implemented.");
    }
    debug(message: any, context?: string | undefined): void {
        throw new Error("Method not implemented.");
    }
    verbose(message: any, context?: string | undefined): void {
        throw new Error("Method not implemented.");
    }
}
const platform = corePlatform([{
    provide: Logger,
    useClass: CoreLogger
}]);
platform.bootstrapModule(AppModule).then(async res => {
    const connection = res.injector.get(Connection, null)
    await connection.connect();
    const result = await connection.query(`select * from member`, [])
    debugger;
})