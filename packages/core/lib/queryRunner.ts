import { Injectable } from "@nger/core";
export interface FieldDef {
    name: string;
    tableID: number;
    columnID: number;
    dataTypeID: number;
    dataTypeSize: number;
    dataTypeModifier: number;
    format: string;
}
export interface QueryResultBase {
    command: string;
    rowCount: number;
    oid: number;
    fields: FieldDef[];
}
export interface QueryResultRow {
    [column: string]: any;
}
export interface QueryResult<R extends QueryResultRow = any> extends QueryResultBase {
    rows: R[];
}
@Injectable()
export abstract class QueryRunner {
    abstract query<T>(query: string, parameters?: any[]): Promise<QueryResult<T>>;
    abstract release(): Promise<void>;
}
