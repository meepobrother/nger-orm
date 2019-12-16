import { StaticProvider } from '@nger/core';
import { deleteHandler } from './delete';
import { insertHandler } from './insert';
import { selectHandler } from './select';
import { updateHandler } from './update';
import { selectOneHandler } from './selectOne';

export * from './delete';
export * from './insert';
export * from './select';
export * from './update';
export * from './selectOne';

export const ngerOrmCoreHandlers: StaticProvider[] = [
    deleteHandler,
    insertHandler,
    selectHandler,
    updateHandler,
    selectOneHandler
]
