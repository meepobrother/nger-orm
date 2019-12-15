import { QueryRunner, Connection, QueryResult } from '@nger/orm.core'
import { PostgresDriver } from './driver';
import { PoolClient } from 'pg';
import { Injector } from '@nger/core';
export class PostgresQueryRunner extends QueryRunner {
    databaseConnection: PoolClient | undefined;
    databaseConnectionPromise: Promise<PoolClient>;
    releaseCallback: (release?: any) => void;
    isReleased = false;
    constructor(
        private driver: PostgresDriver,
        private mode: "master" | "slave",
        private injector: Injector
    ) {
        super();
    }
    release(): Promise<void> {
        this.isReleased = true;
        this.databaseConnection = undefined;
        if (this.releaseCallback)
            this.releaseCallback();
        const index = this.driver.connectedQueryRunners.indexOf(this);
        if (index !== -1) this.driver.connectedQueryRunners.splice(index);
        return Promise.resolve();
    }
    get connection() {
        return this.injector.get(Connection)
    }
    private async connect(): Promise<PoolClient> {
        if (this.databaseConnection) return this.databaseConnection;
        if (this.databaseConnectionPromise) return this.databaseConnectionPromise;
        if (this.mode === "slave") {
            this.databaseConnectionPromise = this.driver.obtainSlaveConnection().then(([connection, release]) => {
                this.driver.connectedQueryRunners.push(this);
                this.databaseConnection = connection;
                this.releaseCallback = release;
                return this.databaseConnection;
            });
        } else {
            this.databaseConnectionPromise = this.driver.obtainMasterConnection().then(([connection, release]) => {
                this.driver.connectedQueryRunners.push(this);
                this.databaseConnection = connection;
                this.releaseCallback = release;
                return this.databaseConnection;
            });
        }
        return this.databaseConnectionPromise;
    }
    query<T>(query: string, parameters: any[] = []): Promise<QueryResult<T>> {
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