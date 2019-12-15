import { QueryRunner, Table, View } from '@nger/orm.core'
import { PostgresDriver } from './driver';
import { PoolClient, QueryResult } from 'pg';
export class PostgresQueryRunner extends QueryRunner {
    databaseConnection: PoolClient;
    releaseCallback: (release?: any) => void;
    isReleased = false;
    constructor(
        private driver: PostgresDriver,
        private mode: "master" | "slave"
    ) {
        super();
    }
    release(): Promise<void> {
        this.isReleased = true;
        if (this.releaseCallback)
            this.releaseCallback();
        const index = this.driver.connectedQueryRunners.indexOf(this);
        if (index !== -1) this.driver.connectedQueryRunners.splice(index);
        return Promise.resolve();
    }
    createTable(table: Table, ifNotExist?: boolean | undefined, createForeignKeys?: boolean | undefined, createIndices?: boolean | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    dropTable(table: string | Table, ifExist?: boolean | undefined, dropForeignKeys?: boolean | undefined, dropIndices?: boolean | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    renameTable(oldTableOrName: string | Table, newTableName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createView(view: View, oldView?: View | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    dropView(view: string | View): Promise<void> {
        throw new Error("Method not implemented.");
    }
    private connect(): Promise<PoolClient> {
        return new Promise((resolve, reject) => {
            if (this.mode === 'master') {
                if (this.driver.master) {
                    this.driver.master.connect((err: Error, client: PoolClient, done: (release?: any) => void) => {
                        if (err) return reject(err);
                        this.driver.connectedQueryRunners.push(this);
                        this.databaseConnection = client;
                        this.releaseCallback = done;
                        resolve(client)
                    })
                } else {
                    reject(Error(`connect error`))
                }
            } else {
                reject(Error(`connect error`))
            }
        })
    }
    query<T>(query: string, parameters: any[]): Promise<QueryResult<T>> {
        return new Promise<QueryResult<T>>(async (ok, fail) => {
            this.connect().then((connection) => {
                connection.query(query, parameters, (err: Error, result: QueryResult<T>) => {
                    if (err) {
                        return fail(err);
                    } else {
                        ok(result);
                    }
                });
            }).catch(err => fail(err));
        });
    }
}