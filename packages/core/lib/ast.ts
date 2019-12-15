export class Statement { }
export class CommitStatement extends Statement {
    toString(): string {
        return `COMMIT`
    }
}
export class SelectStatement extends Statement { }
export class UpdateStatement extends Statement { }
export class DeleteStatement extends Statement { }
export class InsertStatement extends Statement { }

export class Expression { }

export class HexValue { }
export class Function {
    name: string;
}
export class Column { }
export class Database { }
export class Table { }
