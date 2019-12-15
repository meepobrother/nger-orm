import { Driver, SchemaBuilder, QueryRunner, ConnectionOptionsToken } from '@nger/orm.core'
import { Pool, PoolConfig, PoolClient } from 'pg';
import { Logger, Injectable, Injector } from '@nger/core';
import { PostgresConnectionOptions, PostgresOptions, isPostgresUrlCredentials } from './options';
import { PostgresQueryRunner } from './queryRunner';
@Injectable()
export class PostgresDriver extends Driver {
    master: Pool | undefined;
    slaves: Pool[] = [];
    database: string;
    connectedQueryRunners: QueryRunner[] = [];
    constructor(public logger: Logger, public injector: Injector) {
        super();
    }
    async connect(): Promise<void> {
        const options = this.injector.get<PostgresConnectionOptions>(ConnectionOptionsToken);
        this.slaves = await Promise.all((options.replication.slaves || []).map(slave => {
            return this.createPool(slave);
        }));
        this.database = options.replication.master.database;
        this.master = await this.createPool(options.replication.master);
    }
    private createPool(options: PostgresOptions) {
        let poolOptions: PoolConfig = {};
        if (isPostgresUrlCredentials(options)) {
            
        } else {
            poolOptions = {
                user: options.username,
                password: options.password,
                host: options.host,
                port: options.port,
                database: options.database,
                ssl: options.ssl
            }
        }
        const pool = new Pool(poolOptions);
        pool.on("error", (error: any) => this.logger.error(`Postgres pool raised an error. ${error}`));
        return new Promise<Pool>((reolve, reject) => {
            pool.connect((err: any, connection: PoolClient, release: Function) => {
                if (err) return reject(err);
                release();
                reolve(pool);
            });
        });
    }
    private async closePool(pool: any): Promise<void> {
        await Promise.all(this.connectedQueryRunners.map(queryRunner => queryRunner.release()));
        return new Promise<void>((ok, fail) => {
            pool.end((err: any) => err ? fail(err) : ok());
        });
    }
    async disconnect(): Promise<void> {
        await this.closePool(this.master);
        await Promise.all(this.slaves.map(slave => this.closePool(slave)));
        this.master = undefined;
        this.slaves = [];
    }
    createSchemaBuilder(): SchemaBuilder {
        throw new Error("Method not implemented.");
    }
    createQueryRunner(mode: "master" | "slave"): QueryRunner {
        return new PostgresQueryRunner(this, mode);
    }
}