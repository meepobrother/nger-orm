import { ConnectionOptions, ConnectionOptionsToken } from "./token";
import { Driver } from "./driver";
import { Inject, Optional, Injectable, Type } from "@nger/core";
import { QueryRunner } from "./queryRunner";
import { SelectQueryBuilder } from './query-builder/selectQueryBuilder'
import { Repository } from './repository'
import { EntitySchema } from './entitySchema'
@Injectable()
export class Connection {
    name: string;
    isConnected: boolean;
    constructor(
        @Inject(ConnectionOptionsToken)
        @Optional()
        public readonly options: ConnectionOptions,
        public readonly driver: Driver
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
        const usedQueryRunner = queryRunner || this.createQueryRunner("master");
        try {
            return await usedQueryRunner.query(query, parameters);
        } finally {
            if (!queryRunner) {
                await usedQueryRunner.release();
            }
        }
    }
    createQueryRunner(mode: "master" | "slave") {
        return this.driver.createQueryRunner(mode)
    }
    createQueryBuilder<T>(queryRunner?: QueryRunner): SelectQueryBuilder<T> {
        throw new Error("Method not implemented.");
    }
    getRepository<Entity>(target: Type<Entity> | EntitySchema<Entity> | string): Repository<Entity> {
        throw new Error(`Method `)
    }
}