import { createPostGraphileSchema } from "postgraphile-core";
export { sql } from 'graphile-build-pg';
import { graphql, ExecutionResult, GraphQLSchema, Source } from "graphql";
import pg from "pg";
import { Driver } from "@nger/orm.core";
import { Injectable, Injector } from "@nger/core";
import { AppendPluginsToken, PrependPluginsToken, SkipPluginsToken } from "./token";

@Injectable()
export class PgGraphql {
    private _schema: GraphQLSchema;
    private driver: Driver<pg.Pool>;
    constructor(
        private injector: Injector
    ) { }
    async getSchema() {
        this.driver = this.injector.get(Driver)
        await this.driver.connect();
        if (this._schema) return this._schema;
        const appendPlugins = this.injector.get(AppendPluginsToken, []);
        const prependPlugins = this.injector.get(PrependPluginsToken, []);
        const skipPlugins = this.injector.get(SkipPluginsToken, []);
        this._schema = await createPostGraphileSchema(
            this.driver.master,
            this.driver.options.schema!,
            {
                dynamicJson: true,
                enableTags: true,
                subscriptions: true,
                skipPlugins,
                prependPlugins,
                appendPlugins,
                live: true
            }
        );
        return this._schema;
    }
    async query<T>(query: string | Source, variables: any = {}): Promise<ExecutionResult<T>> {
        return await graphql(
            await this.getSchema(),
            query,
            null,
            {
                pgClient: this.driver.master,
            },
            variables
        );
    }
}
