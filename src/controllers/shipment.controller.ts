import express from 'express';
import winston from 'winston';
import { SERVICE_TYPES } from '../types';
import { Logger } from '../core/logger';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { ShipmentService } from '../services/shipment.service';
import { Shipment } from 'src/types/types';

@injectable()
export class ShipmenController implements ControllerDefinition {
    private logger: winston.Logger;
    private shipmentService: ShipmentService;
    
    constructor(
        @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
        @inject(SERVICE_TYPES.ShipmentService) shipmentService: ShipmentService
    ) {
        this.logger = winstonLogger.getLogger(`[${ShipmenController.name}]`);
        this.shipmentService = shipmentService;
    }

    public configureRoutes(app: express.Application): express.Application {

        app.post('/shipment', async (req: any, res: any) => {
            this.logger.info('🗄️ Processing request to save Shipment');
            if(!req.body.referenceId) {
                this.logger.warn('⚠️ Missing referenceId.  Unable to create/update Shipment');
                res.status(400).send('Bad Request'); // TODO: validate response;
            }

            const shipment: Shipment = {
                referenceId: req.body.referenceId,
                estimatedTimeArrival: req.body.estimatedTimeArrival,
                organizations: req.body.organizations,
            }

            this.shipmentService.createOrUpdateShipment(shipment);
            res.status(200).send('Shipment successfully saved');
        });
        
        app.get('/shipments/:shipmentId', (req: any, res: any) => {
            this.shipmentService.getShipmentById();
            res.send('Hello World from shipments!');
        });

        this.logger.info('routes for shipments successfully configured ✅');
        return app;
    }
}
