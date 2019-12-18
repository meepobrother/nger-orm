import { Module, OnModuleInit, InjectFlags, Injectable } from '@nger/core';
import { Connection, Select, ngerOrmCoreHandlers } from '@nger/orm.core';
import { PostgresOrmModule } from '@nger/orm.postgres';
import { expressPlatform } from '@nger/platform.express';
@Injectable()
export class DemoInjectable {
    @Select(`select * from member`)
    getAllMembers: () => Promise<any[]>
}
@Module({
    imports: [
        PostgresOrmModule.forFeature({
            name: 'default',
            uuidExtension: 'pgcrypto',
            database: `zp`,
            entities: [],
            replication: {
                master: {
                    host: `193.112.55.191`,
                    port: 5432,
                    username: `magnus`,
                    password: `magnus`
                }
            }
        })
    ],
    controllers: [
        DemoInjectable
    ],
    providers: []
})
export class AppModule implements OnModuleInit {
    ngOnModuleInit() {
        console.log(`AppModule`)
    }
}
const platform = expressPlatform([
    ...ngerOrmCoreHandlers
]);
platform.bootstrapModule(AppModule).then()