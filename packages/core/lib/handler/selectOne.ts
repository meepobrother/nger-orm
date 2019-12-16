import { StaticProvider, PropertyHandler, Injector } from "@nger/core";
import { SelectOneMetadataKey } from "../decorator";
import { Connection } from "../connection";
import { IPropertyDecorator } from '@nger/decorator';
const handler: PropertyHandler<any, string> = (value: any, instance: any, injector: Injector, parameter: IPropertyDecorator<any, string>) => {
    if (parameter.options) {
        const connection = injector.get(Connection);
        const options = parameter.options;
        value = (...args: any[]) => {
            return connection.query<any>(options, args).then(res => {
                if (res.length > 0) return res[0];
                return undefined;
            });
        }
    }
    Reflect.set(instance, parameter.property, value)
}
export const selectOneHandler: StaticProvider = {
    provide: SelectOneMetadataKey,
    useValue: handler
}
