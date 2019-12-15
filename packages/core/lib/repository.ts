import { QueryRunner } from "./queryRunner";
import { SelectQueryBuilder } from "typeorm";

export abstract class Repository<T> {
    abstract createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T>;
}
