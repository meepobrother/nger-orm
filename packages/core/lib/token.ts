import { InjectionToken, Type } from "@nger/di";
export interface ConnectionOptions {
    name: string;
    schema?: string;
    entities: Type<any>[];
}
export const ConnectionOptionsToken = new InjectionToken<ConnectionOptions>(`ConnectionOptionsToken`)
