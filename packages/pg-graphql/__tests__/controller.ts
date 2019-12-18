import { Controller, All, Req, Res, Next, Injector, RequestToken, ResponseToken, Get } from '@nger/core';
import { PgGraphql } from '../lib';
import { Driver } from '@nger/orm.core';
import { join } from 'path';
@Controller('/')
export class GraphqlController {
    constructor(private _graphql: PgGraphql, private driver: Driver, private injector: Injector) { }
    @Get('/')
    index() {
        const res = this.injector.get<any>(ResponseToken)
        res.sendFile(join(__dirname, 'html', 'index.html'))
    }
}
