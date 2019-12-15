import { createClassDecorator } from "@nger/decorator";
export const EntityMetadataKey = `EntityMetadataKey`
export interface EntityOptions { }
export const Entity = createClassDecorator<EntityOptions>(EntityMetadataKey)

export const ColumnMetadataKey = `ColumnMetadataKey`
export interface ColumnOptions { }
export const Column = createClassDecorator<ColumnOptions>(ColumnMetadataKey)

