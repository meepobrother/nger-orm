export class AlreadyHasActiveConnectionError extends Error {
    name = "AlreadyHasActiveConnectionError";
    constructor(connectionName: string) {
        super();
        Object.setPrototypeOf(this, AlreadyHasActiveConnectionError.prototype);
        this.message = `Cannot create a new connection named "${connectionName}", because connection with such name ` +
            `already exist and it now has an active connection session.`;
    }
}
export class ConnectionNotFoundError extends Error {
    name = "ConnectionNotFoundError";
    constructor(name: string) {
        super();
        Object.setPrototypeOf(this, ConnectionNotFoundError.prototype);
        this.message = `Connection "${name}" was not found.`;
    }
}