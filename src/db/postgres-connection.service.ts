import { injectable } from "inversify";
import { DataBaseDefinition } from "src/interfaces/database.interface";

@injectable()
export class PostgresConnectionService implements DataBaseDefinition {
    constructor() {
    }

    public async connect(): Promise<void> {
        // TODO: Implement
    }
}