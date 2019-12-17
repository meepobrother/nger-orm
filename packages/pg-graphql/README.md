# `pg-graphql`

> graphql to postgres

## Usage

```ts
import { Module, OnModuleInit, Injectable } from '@nger/core';
import { Select, ngerOrmCoreHandlers } from '@nger/orm.core';
import { platformNode } from '@nger/platform.node';
import { PgGraphql, PgGraphqlModule } from '@nger/pg-graphql';
@Injectable()
export class DemoInjectable {
    @Select(`select * from member`)
    getAllMembers: () => Promise<any[]>
}
@Module({
    imports: [
        PgGraphqlModule.forFeature({
            name: 'default',
            uuidExtension: 'pgcrypto',
            database: `zp`,
            schema: 'public',
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
const platform = platformNode([
    ...ngerOrmCoreHandlers
]);
platform.bootstrapModule(AppModule).then(async res => {
    const graphql = res.injector.get(PgGraphql)
    const schema = await graphql.getSchema();
    const result = await graphql.query(`
    query allAccounts{
        allAccounts {
            nodes { 
                id, 
                level,
                memberByAccountId{
                    id,
                    city
                }
            }
        }
    }
    `)
    debugger;
})
```
