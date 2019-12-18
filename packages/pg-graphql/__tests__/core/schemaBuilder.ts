import graphql, { GraphQLSchema } from 'graphql';
import { Injectable } from '@nger/core';
export type TriggerChangeType = () => void;
export type SchemaListener = (newSchema: GraphQLSchema) => void;
export type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

@Injectable()
export abstract class SchemaBuilder {
    abstract registerWatcher(listen: WatchUnwatch, unlisten: WatchUnwatch): void;
    abstract createBuild(): Build;
    abstract buildSchema(): GraphQLSchema;
    abstract watchSchema(listener?: SchemaListener): Promise<void>;
    abstract unwatchSchema(): Promise<void>;
}
export class Build {
    graphql: typeof graphql;
}
