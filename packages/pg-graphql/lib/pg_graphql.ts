import { createPostGraphileSchema, PostGraphileCoreOptions } from "postgraphile-core";
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
    async getSchema(): Promise<GraphQLSchema> {
        this.driver = this.injector.get(Driver)
        await this.driver.connect();
        if (this._schema) return this._schema;
        this._schema = await createPostGraphileSchema(
            this.driver.master,
            this.driver.options.schema!,
            this.getOptions()
        );
        return this._schema;
    }
    getOptions(): PostGraphileCoreOptions {
        const appendPlugins = this.injector.get(AppendPluginsToken, []);
        const prependPlugins = this.injector.get(PrependPluginsToken, []);
        const skipPlugins = this.injector.get(SkipPluginsToken, []);
        return {
            dynamicJson: true,
            enableTags: true,
            subscriptions: true,
            skipPlugins,
            prependPlugins,
            appendPlugins
        }
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
