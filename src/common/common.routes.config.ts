import express from 'express';
import { inject } from 'inversify';
import { SERVICE_TYPES } from '../types';
import winston from 'winston';
export abstract class CommonRoutesConfig {

    private logger: winston.Logger;

    constructor(@inject(SERVICE_TYPES.Logger) private winstonLogger?: winston.Logger) {
        this.logger = winstonLogger!;
        this.logger.info('CommonRoutesConfig constructor set');
    }
    
    abstract configureRoutes(app: express.Application): express.Application;
}