import { QueryRunner } from './queryRunner';
/**
 * 驱动
 */
export abstract class Driver {
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract createSchemaBuilder(): SchemaBuilder;
    abstract createQueryRunner(mode: "master" | "slave"): QueryRunner;
}

export class Query {
    constructor(public query: string, public parameters?: any[]) { }
}

export class SqlInMemory {
    upQueries: Query[] = [];
    downQueries: Query[] = [];
}

export abstract class SchemaBuilder {
    abstract build(): Promise<void>;
    abstract log(): Promise<SqlInMemory>;
}
