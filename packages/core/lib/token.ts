import { InjectionToken, Type } from "@nger/di";
export interface ConnectionOptions {
    name?: string;
    schema?: string;
    entities: Type<any>[];
}
export const CURRENT_CONNECTION_OPTIONS = new InjectionToken<ConnectionOptions>(`CURRENT_CONNECTION_OPTIONS`)