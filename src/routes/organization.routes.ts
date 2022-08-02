import express from 'express';
import winston from 'winston';
import { RouteDefinition } from '../interfaces/route.interface';
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { OrganizationService } from '../services/organization.service';

@injectable()
export class OrganizationRoutes implements RouteDefinition {
    private logger: winston.Logger;
    private organizationService: OrganizationService;

    constructor(
        @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
        @inject(SERVICE_TYPES.OrganizationService) organizationService: OrganizationService
    ) {
        this.logger = winstonLogger.getLogger(`[${OrganizationRoutes.name}]`);
        this.organizationService = organizationService;
    }

    configureRoutes(app: express.Application): express.Application {
        
        app.post('/organization', (req: any, res: any) => {
        });
        
        app.get('/organizations/:organizationId', (req: any, res: any) => {
            this.organizationService.test();
            res.send('Hello World from organizations!');
        });

        this.logger.info('routes for organizations successfully configured ✅');
        return app;
    }
}
