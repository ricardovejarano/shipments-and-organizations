import express from 'express';
import winston from 'winston';
import { SERVICE_TYPES } from '../types';
import { Logger } from '../core/logger';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { ShipmentService } from '../services/shipment.service';
import { Shipment, TransportPack } from '../types/types';

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

            if(!req.body.referenceId) {
                this.logger.warn('⚠️ Missing referenceId.  Unable to create/update Shipment');
                res.status(400).send('Bad Request'); // TODO: validate response;
            }
            const estimatedTimeArrival = req.body.estimatedTimeArrival ? new Date(req.body.estimatedTimeArrival) : undefined;
            const shipment: Shipment = {
                referenceId: req.body.referenceId,
                estimatedTimeArrival,
                organizations: req.body.organizations,
                transportPacks: req.body.transportPacks as TransportPack,
            }

            this.logger.info(`🗄️ Processing request for Shipment ${shipment.referenceId}`);
            try {
                await this.shipmentService.createOrUpdateShipment(shipment);
                this.logger.info(`💾 Shipment ${shipment.referenceId} successfully processed`);
                res.status(200).send('Shipment successfully saved');
            } catch(e) {
                this.logger.error(`⚠️ Error processing Shipment ${shipment.referenceId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });
        
        app.get('/shipments/:shipmentId', async (req: any, res: any) => {
            try {
                const shipment = await this.shipmentService.getShipmentById( req.params.shipmentId );
                res.send(shipment);
            } catch(e) {
                this.logger.error(`⚠️ Error getting Shipment ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
            
        });

        this.logger.info('routes for shipments successfully configured ✅');
        return app;
    }
}
