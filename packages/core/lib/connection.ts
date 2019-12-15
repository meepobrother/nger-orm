import { ConnectionOptions, ConnectionOptionsToken } from "./token";
import { Driver } from "./driver";
import { Inject, Optional, Injectable, Injector } from "@nger/core";
import { QueryRunner } from "./queryRunner";
@Injectable()
export class Connection {
    name: string;
    isConnected: boolean;
    constructor(
        @Inject(ConnectionOptionsToken)
        @Optional()
        public readonly options: ConnectionOptions,
        public readonly driver: Driver,
        public readonly injector: Injector
    ) {
        this.name = options.name;
    }
    async connect(): Promise<Connection> {
        await this.driver.connect();
        return this;
    }
    close(): Promise<void> {
        return this.driver.disconnect();
    }
    async query<T = any>(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<T> {
        const usedQueryRunner = queryRunner || this.driver.createQueryRunner("master");
        try {
            return await usedQueryRunner.query(query, parameters);
        } catch (e) {
            throw e;
        } finally {
            if (!queryRunner) {
                await usedQueryRunner.release();
            }
        }
    }
}