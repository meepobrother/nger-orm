import { createPropertyDecorator } from "@nger/decorator";

export const InsertMetadataKey = `InsertMetadataKey`;
export interface Insert<T> {
    (...args: any[]): Promise<void>;
}
export const Insert = createPropertyDecorator<string>(InsertMetadataKey);

export const UpdateMetadataKey = `UpdateMetadataKey`;
export interface Update<T> {
    (...args: any[]): Promise<void>;
}
export const Update = createPropertyDecorator<string>(UpdateMetadataKey);

export const SelectMetadataKey = `SelectMetadataKey`;
export interface Select<T> {
    (...args: any[]): Promise<T[]>;
}
export const Select = createPropertyDecorator<string>(SelectMetadataKey);

export const SelectOneMetadataKey = `SelectOneMetadataKey`;
export interface SelectOne<T> {
    (...args: any[]): Promise<T | undefined>;
}
export const SelectOne = createPropertyDecorator<string>(SelectOneMetadataKey);

export const DeleteMetadataKey = `DeleteMetadataKey`;
export interface Delete<T> {
    (...args: any[]): Promise<void>;
}
export const Delete = createPropertyDecorator<string>(DeleteMetadataKey);
