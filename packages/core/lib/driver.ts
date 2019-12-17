import { QueryRunner } from './queryRunner';
import { ConnectionOptions } from './token';
/**
 * 驱动
 */
export abstract class Driver<T = any> {
    master: T;
    slaves: T[] = [];
    database: string;
    options: ConnectionOptions;
    abstract connect(): Promise<Driver<T>>;
    abstract disconnect(): Promise<void>;
    abstract createQueryRunner(mode: "master" | "slave"): QueryRunner;
}
