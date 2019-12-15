import { Connection } from "./connection";
import { Injectable } from "@nger/core";
import { Broadcaster } from "./broadCaster";
import { View, Table } from "./table";

@Injectable()
export abstract class QueryRunner {
    abstract query(query: string, parameters?: any[]): Promise<any>;
    abstract createTable(table: Table, ifNotExist?: boolean, createForeignKeys?: boolean, createIndices?: boolean): Promise<void>;
    abstract dropTable(table: Table | string, ifExist?: boolean, dropForeignKeys?: boolean, dropIndices?: boolean): Promise<void>;
    abstract renameTable(oldTableOrName: Table | string, newTableName: string): Promise<void>;
    abstract createView(view: View, oldView?: View): Promise<void>;
    abstract dropView(view: View | string): Promise<void>;
    abstract release(): Promise<void>;
}
