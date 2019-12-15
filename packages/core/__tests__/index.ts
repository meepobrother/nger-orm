import { corePlatform, Module, OnModuleInit } from '@nger/core';
import {
    OrmModule, Connection, CoreDriver,
    SchemaBuilder, QueryRunner, EntityManager, Entity
} from '../lib';
import { createConnection } from 'typeorm'
export class PostgresDriver extends CoreDriver {
    connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createSchemaBuilder(): SchemaBuilder {
        throw new Error("Method not implemented.");
    }
    createQueryRunner(mode: "master" | "slave"): QueryRunner {
        throw new Error("Method not implemented.");
    }
}

@Entity()
export class User { }

@Module({
    imports: [
        OrmModule.forFeature({
            name: 'default',
            entities: [
                User
            ]
        })
    ],
    providers: [{
        provide: CoreDriver,
        useClass: PostgresDriver
    }]
})
export class AppModule implements OnModuleInit {
    ngOnModuleInit() {
        console.log(`AppModule`)
    }
}
const platform = corePlatform([]);
platform.bootstrapModule(AppModule).then(res => {
    const connection = res.injector.get(Connection, null)
    const queryRunner = res.injector.get(QueryRunner)
    const entityManager = res.injector.get(EntityManager)
    debugger;
})