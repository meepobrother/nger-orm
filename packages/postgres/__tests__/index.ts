import { Module, OnModuleInit, InjectFlags } from '@nger/core';
import { Connection } from '@nger/orm.core';
import { PostgresOrmModule } from '@nger/orm.postgres';
import { platformNode } from '@nger/platform.node';
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
    providers: []
})
export class AppModule implements OnModuleInit {
    ngOnModuleInit() {
        console.log(`AppModule`)
    }
}
const platform = platformNode([]);
platform.bootstrapModule(AppModule).then(async res => {
    const connection = res.injector.get(Connection, null, InjectFlags.Optional)
    await connection.connect();
    const result = await connection.query(`select * from member where id = $1`, [3])
    debugger;
})