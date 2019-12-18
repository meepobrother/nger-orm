import { createPropertyDecorator } from "@nger/decorator";

export const InsertMetadataKey = `InsertMetadataKey`;
export interface IInsert<T> {
    (...args: any[]): Promise<T>;
}
export const Insert = createPropertyDecorator<string, string>(InsertMetadataKey);

export const UpdateMetadataKey = `UpdateMetadataKey`;
export interface IUpdate<T> {
    (...args: any[]): Promise<T>;
}
export const Update = createPropertyDecorator<string>(UpdateMetadataKey);

export const SelectMetadataKey = `SelectMetadataKey`;
export interface ISelect<T> {
    (...args: any[]): Promise<T[]>;
}
export const Select = createPropertyDecorator<string>(SelectMetadataKey);

export const SelectOneMetadataKey = `SelectOneMetadataKey`;
export interface ISelectOne<T> {
    (...args: any[]): Promise<T | undefined>;
}
export const SelectOne = createPropertyDecorator<string>(SelectOneMetadataKey);

export const DeleteMetadataKey = `DeleteMetadataKey`;
export interface IDelete<T> {
    (...args: any[]): Promise<void>;
}
export const Delete = createPropertyDecorator<string>(DeleteMetadataKey);
