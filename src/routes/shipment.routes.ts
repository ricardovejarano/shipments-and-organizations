import express from 'express';
import winston from 'winston';
import { SERVICE_TYPES } from '../types';
import { Logger } from '../core/logger';
import { RouteDefinition } from '../interfaces/route.interface';
import { inject, injectable } from 'inversify';
import { ShipmentService } from '../services/shipment.service';

@injectable()
export class ShipmentRoutes implements RouteDefinition {
    private logger: winston.Logger;
    private shipmentService: ShipmentService;
    
    constructor(
        @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
        @inject(SERVICE_TYPES.ShipmentService) shipmentService: ShipmentService
    ) {
        this.logger = winstonLogger.getLogger(`[${ShipmentRoutes.name}]`);
        this.shipmentService = shipmentService;
    }

    public configureRoutes(app: express.Application): express.Application {

        app.post('/shipment', async (req: any, res: any) => {
        });
        
        app.get('/shipments/:shipmentId', (req: any, res: any) => {
            this.shipmentService.getShipmentById();
            res.send('Hello World from shipments!');
        });

        this.logger.info('routes for shipments successfully configured ✅');
        return app;
    }
}
