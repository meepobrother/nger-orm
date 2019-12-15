import { QueryRunner } from './queryRunner';
/**
 * 驱动
 */
export abstract class Driver {
    abstract connect(): Promise<Driver>;
    abstract disconnect(): Promise<void>;
    abstract createQueryRunner(mode: "master" | "slave"): QueryRunner;
}
