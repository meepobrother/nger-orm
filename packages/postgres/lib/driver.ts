import { Driver, QueryRunner, ConnectionOptionsToken } from '@nger/orm'
import { Pool, PoolConfig, PoolClient } from 'pg';
import { Logger, Injectable, Injector } from '@nger/core';
import { PostgresConnectionOptions, PostgresOptions, isPostgresUrlCredentials } from './options';
import { PostgresQueryRunner } from './queryRunner';
import { parse } from 'pg-connection-string';
@Injectable()
export class PostgresDriver extends Driver<Pool> {
    master: Pool;
    slaves: Pool[] = [];
    database: string;
    connectedQueryRunners: QueryRunner[] = [];
    options: PostgresConnectionOptions;
    constructor(public logger: Logger, public injector: Injector) {
        super();
        this.options = this.injector.get<PostgresConnectionOptions>(ConnectionOptionsToken)
    }
    async connect(): Promise<PostgresDriver> {
        this.slaves = await Promise.all((this.options.replication.slaves || []).map(slave => {
            return this.createPool(slave);
        }));
        this.database = this.options.database;
        this.master = await this.createPool(this.options.replication.master);
        return this;
    }
    async disconnect(): Promise<void> {
        await this.closePool(this.master);
        await Promise.all(this.slaves.map(slave => this.closePool(slave)));
        this.master = undefined as any;
        this.slaves = [];
    }
    createQueryRunner(mode: "master" | "slave"): QueryRunner {
        return new PostgresQueryRunner(this, mode);
    }
    obtainSlaveConnection(): Promise<[PoolClient, (release?: any) => void]> {
        if (!this.slaves.length)
            return this.obtainMasterConnection();
        return new Promise((ok, fail) => {
            const random = Math.floor(Math.random() * this.slaves.length);
            this.slaves[random].connect((err: any, connection: any, release: any) => {
                err ? fail(err) : ok([connection, release]);
            });
        });
    }
    obtainMasterConnection(): Promise<[PoolClient, (release?: any) => void]> {
        return new Promise((ok, fail) => {
            this.master.connect((err: any, connection: any, release: any) => {
                err ? fail(err) : ok([connection, release]);
            });
        });
    }
    /**
     * private methods
     * @param {PostgresOptions} options 
     */
    private createPool(options: PostgresOptions) {
        let poolOptions: PoolConfig = {};
        if (isPostgresUrlCredentials(options)) {
            const opt = parse(options.url);
            poolOptions = {
                user: opt.user,
                password: opt.password,
                host: opt.host!,
                port: parseInt(opt.port!),
                database: this.options.database,
                ssl: options.ssl
            }
        } else {
            poolOptions = {
                user: options.username,
                password: options.password,
                host: options.host,
                port: options.port,
                database: this.options.database,
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
}