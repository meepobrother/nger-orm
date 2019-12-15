import { Connection } from "./connection";
import { Injectable } from "@nger/core";
import { QueryRunner } from "./queryRunner";

@Injectable()
export class EntityManager {
    constructor(
        public readonly connection: Connection,
        public readonly queryRunner: QueryRunner
    ) { }
}
