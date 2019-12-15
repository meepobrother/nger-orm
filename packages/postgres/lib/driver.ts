import { Driver, QueryRunner, ConnectionOptionsToken, Connection } from '@nger/orm.core'
import { Pool, PoolConfig, PoolClient } from 'pg';
import { Logger, Injectable, Injector } from '@nger/core';
import { PostgresConnectionOptions, PostgresOptions, isPostgresUrlCredentials } from './options';
import { PostgresQueryRunner } from './queryRunner';
@Injectable()
export class PostgresDriver extends Driver {
    master: Pool;
    slaves: Pool[] = [];
    database: string;
    connectedQueryRunners: QueryRunner[] = [];
    options: PostgresConnectionOptions;
    constructor(public logger: Logger, public injector: Injector) {
        super();
    }
    async connect(): Promise<PostgresDriver> {
        this.options = this.injector.get<PostgresConnectionOptions>(ConnectionOptionsToken);
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
        return new PostgresQueryRunner(this, mode, this.injector);
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
            const opt = this.parseConnectionUrl(options.url);
            poolOptions = {
                user: opt.username,
                password: opt.password,
                host: opt.host,
                port: opt.port,
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
    private parseConnectionUrl(url: string) {
        const type = url.split(":")[0];
        const firstSlashes = url.indexOf("//");
        const preBase = url.substr(firstSlashes + 2);
        const secondSlash = preBase.indexOf("/");
        const base = (secondSlash !== -1) ? preBase.substr(0, secondSlash) : preBase;
        const afterBase = (secondSlash !== -1) ? preBase.substr(secondSlash + 1) : undefined;
        const lastAtSign = base.lastIndexOf("@");
        const usernameAndPassword = base.substr(0, lastAtSign);
        const hostAndPort = base.substr(lastAtSign + 1);
        let username = usernameAndPassword;
        let password = "";
        const firstColon = usernameAndPassword.indexOf(":");
        if (firstColon !== -1) {
            username = usernameAndPassword.substr(0, firstColon);
            password = usernameAndPassword.substr(firstColon + 1);
        }
        const [host, port] = hostAndPort.split(":");
        return {
            type: type,
            host: host,
            username: decodeURIComponent(username),
            password: decodeURIComponent(password),
            port: port ? parseInt(port) : undefined,
            database: afterBase || undefined
        };
    }
}