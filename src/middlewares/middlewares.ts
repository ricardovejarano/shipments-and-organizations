import { NextFunction, Request, Response } from "express";

export class Middlewares {

    public async trackRequest(req: Request, res: Response, next: NextFunction) {
        // this might work for us to track the requests, validate schemas, etc.
        next();
    }
}
