import { Module } from "@nger/core";
import { Connection } from "./connection";
import { ngerOrmCoreHandlers } from "./handler";
@Module({
    providers: [
        Connection,
        ...ngerOrmCoreHandlers
    ]
})
export class OrmModule { }
