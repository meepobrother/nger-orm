import { StaticProvider, PropertyHandler, Injector } from "@nger/core";
import { InsertMetadataKey } from "../decorator";
import { Connection } from "../connection";
import { IPropertyDecorator } from '@nger/decorator';
const handler: PropertyHandler<any, string> = (value: any, instance: any, injector: Injector, parameter: IPropertyDecorator<any, string>) => {
    if (parameter.options) {
        const connection = injector.get(Connection);
        const options = parameter.options;
        value = (...args: any[]) => connection.query<any>(options, args)
    }
    Reflect.set(instance, parameter.property, value)
}
export const insertHandler: StaticProvider = {
    provide: InsertMetadataKey,
    useValue: handler
}
