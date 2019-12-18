import { Module, OnModuleInit, PLATFORM_INITIALIZER, Injector, AppToken, Config } from '@nger/core';
import { ngerOrmCoreHandlers, Driver } from '@nger/orm.core';
import { expressPlatform } from '@nger/platform.express';
import { PgGraphql, PgGraphqlModule } from '../lib';
import { GraphqlController } from './controller'
import express, { Application } from 'express';
import { join } from 'path';
import postgraphile, { PostGraphileOptions } from 'postgraphile';
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
        GraphqlController
    ]
})
export class AppModule implements OnModuleInit {
    ngOnModuleInit() {
        console.log(`AppModule`)
    }
}
const platform = expressPlatform([
    {
        provide: PLATFORM_INITIALIZER,
        useFactory: (injector: Injector) => {
            return () => {
                setTimeout(() => {
                    const app = injector.get<Application>(AppToken);
                    app.use(express.static(join(__dirname, 'html')))
                }, 100)
            }
        },
        deps: [Injector],
        multi: true
    },
    ...ngerOrmCoreHandlers
]);
platform.bootstrapModule(AppModule).then(async res => {
    const config = res.injector.get(Config);
    const port = config.get('PORT', 5000);
    const driver = res.injector.get<Driver<any>>(Driver);
    const graphql = res.injector.get(PgGraphql)
    const app = res.injector.get<express.Application>(AppToken);
    await driver.connect();
    app.use(postgraphile(driver.master, 'public', graphql.getOptions() as any));
    app.listen(port, `0.0.0.0`, () => {
        console.log(`app start at http://0.0.0.0:${port}`);
    });
    return app;
});
