import { ConnectionOptions } from "@nger/orm.core";
import { TlsOptions } from "tls";
interface PostgresBase {
    database: string;
    ssl?: boolean | TlsOptions;
}
export interface PostgresUrlCredentials extends PostgresBase {
    url: string;
}
export function isPostgresUrlCredentials(val: any): val is PostgresUrlCredentials {
    return typeof val.url === 'string'
}
export interface PostgresCredentialsOptions extends PostgresBase {
    host: string;
    port: number;
    username: string;
    password: string;
}
export type PostgresOptions = PostgresUrlCredentials | PostgresCredentialsOptions;
export interface PostgresConnectionOptions extends ConnectionOptions {
    schema?: string;
    uuidExtension: "pgcrypto" | "uuid-ossp";
    replication: {
        master: PostgresOptions;
        slaves?: PostgresOptions[];
    };
}
