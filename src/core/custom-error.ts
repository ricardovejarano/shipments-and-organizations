export class CustomError extends Error {
    public code: number;
    public description: string;

    constructor(code: number, description: string) {
        super(`Custom error: ${description}`);

        this.code = code;
        this.description = description;
    }
}