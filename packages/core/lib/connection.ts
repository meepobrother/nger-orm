import { Driver } from "./driver";
import { Injectable } from "@nger/core";
import { QueryRunner } from "./queryRunner";
@Injectable()
export class Connection {
    isConnected: boolean;
    constructor(
        public readonly driver: Driver
    ) { }
    async connect(): Promise<Connection> {
        await this.driver.connect();
        this.isConnected = true;
        return this;
    }
    close(): Promise<void> {
        this.isConnected = false;
        return this.driver.disconnect();
    }
    createRunner(mode: "master" | "slave"): QueryRunner {
        return this.driver.createQueryRunner(mode)
    }
    /**
     * 执行单条sql语句
     */
    async query<T = any>(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<T[]> {
        if (!this.isConnected) {
            await this.connect();
        }
        const usedQueryRunner = queryRunner || this.driver.createQueryRunner("master");
        try {
            return await usedQueryRunner.query<T>(query, parameters).then(res => res.rows);
        } catch (e) {
            throw e;
        } finally {
            if (!queryRunner) {
                await usedQueryRunner.release();
            }
        }
    }
    /**
     * 用事务执行单条sql语句
     */
    async queryTransaction<T = any>(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<T[]> {
        if (!this.isConnected) {
            await this.connect();
        }
        const usedQueryRunner = queryRunner || this.driver.createQueryRunner("master");
        await usedQueryRunner.query("BEGIN");
        try {
            return (await usedQueryRunner.query<T>(query, parameters)).rows;
        } catch (e) {
            await usedQueryRunner.query("ROLLBACK");
            throw e;
        } finally {
            if (!queryRunner) {
                await usedQueryRunner.query("COMMIT");
                await usedQueryRunner.release();
            }
        }
    }
}
