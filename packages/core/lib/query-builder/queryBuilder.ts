import { SelectQueryBuilder } from "./selectQueryBuilder";
import { InsertQueryBuilder } from "./insertQueryBuilder";
import { UpdateQueryBuilder } from "./updateQueryBuilder";
import { DeleteQueryBuilder } from "./deleteQueryBuilder";
import { RelationQueryBuilder } from "./relationQueryBuilder";

export abstract class QueryBuilder<T> {
    readonly alias: string;
    abstract getSql(): string;
    abstract getQuery(): string;
    abstract printSql(): QueryBuilder<T>;
    abstract createQueryBuilder(): QueryBuilder<T>;
    abstract select(): SelectQueryBuilder<T>;
    abstract insert(): InsertQueryBuilder<T>;
    abstract update(): UpdateQueryBuilder<T>;
    abstract delete(): DeleteQueryBuilder<T>;
    abstract relation(propertyPath: string): RelationQueryBuilder<T>;
    abstract execute<T>(): Promise<T>;
    abstract clone(): QueryBuilder<T>;
}