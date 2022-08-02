import express from 'express';
import { SERVICE_TYPES } from '../types';
import { Logger } from '../core/logger';
import { RouteDefinition } from '../interfaces/route.interface';
import winston from 'winston';
import { inject, injectable } from 'inversify';

@injectable()
export class ShipmentRoutes implements RouteDefinition {
    private logger: winston.Logger;
    
    constructor(@inject(SERVICE_TYPES.Logger) winstonLogger: Logger) {
        this.logger = winstonLogger.getLogger(`[${ShipmentRoutes.name}]`);
    }

    public configureRoutes(app: express.Application): express.Application {

        app.post('/shipment', async (req: any, res: any) => {
        });
        
        app.get('/shipments/:shipmentId', (req: any, res: any) => {
            res.send('Hello World from shipments!');
        });

        this.logger.info('routes for shipments configured');
        return app;
    }
}
