import express, { Request, Response } from 'express';
import winston from 'winston';
import { SERVICE_TYPES } from '../types';
import { Logger } from '../core/logger';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { ShipmentService } from '../services/shipment.service';
import { Shipment, TransportPack } from '../types/types';
import { WeightUnit } from '../services/weight-converter.service';

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

        app.post('/shipment', async (req: Request, res: Response) => {

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
        
        app.get('/shipments/:shipmentId', async (req: Request, res: Response) => {
            try {
                const shipment = await this.shipmentService.getShipmentById( req.params.shipmentId );
                res.send(shipment);
            } catch(e) {
                this.logger.error(`⚠️ Error getting Shipment ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
            
        });

        /**
         * Returns all the organizations tracked per each shipment
         */
        app.get('/shipments/organizations/:shipmentId', async (req: Request, res: Response) => {
            try {
                const organizationsOnShipment = await this.shipmentService.getOrganizationsOnShipment( req.params.shipmentId );
                res.send(organizationsOnShipment);
            } catch(e) {
                this.logger.error(`⚠️ Error getting Organizations on Shipment ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });

        app.get('/shipments/organizations-with-code/:shipmentId', async (req: Request, res: Response) => {
            try {
                const organizationsOnShipment = await this.shipmentService.getOrganizationsWithCodeOnShipment( req.params.shipmentId );
                res.send(organizationsOnShipment);
            } catch(e) {
                this.logger.error(`⚠️ Error getting Organizations with Coupon on Shipment ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });

        app.get('/shipments/estimated-time-arrival/:shipmentId', async (req: Request, res: Response) => {
            try {
                const timeArrival = await this.shipmentService.getEstimatedTimeArrival( req.params.shipmentId );
                res.send({ estimatedTimeArrival: timeArrival ?? 'unknown' });
            } catch(e) {
                this.logger.error(`⚠️ Error getting time arrival ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });

        app.get('/shipments/shipment-weight/:shipmentId/:units', async (req: Request, res: Response) => {
            const shipmentId = req.params.shipmentId;
            const units = req.params.units;

            try {
                if(!shipmentId || !units) {
                    this.logger.warn('⚠️ Missing shipmentId or units.  Unable to get total weight');
                    throw new Error('Missing shipmentId or units');
                }
                
                if (!Object.values(WeightUnit).includes(units as WeightUnit)) {
                    this.logger.warn(`⚠️ Invalid units ${units}.  Unable to get total weight`);
                    throw new Error('Invalid units');
                }

                const totalWeight = await this.shipmentService.getShipmentWeight(shipmentId, units as WeightUnit);
                res.status(400).send({ totalWeight: totalWeight , units });
            } catch(e) {
                this.logger.error(`⚠️ Error getting total weight ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });

        app.get('/shipments/total-weight/:units', async (req: Request, res: Response) => {
            const units = req.params.units;

            try {
                if (!units || !Object.values(WeightUnit).includes(units as WeightUnit)) {
                    this.logger.warn(`⚠️ Invalid units ${units}.  Unable to get total weight`);
                    throw new Error('Invalid units');
                }

                const totalWeight = await this.shipmentService.getTotalWeight(units as WeightUnit);
                res.status(400).send({ totalWeight: totalWeight , units });
            } catch(e) {
                this.logger.error(`⚠️ Error getting total weight ${req.params.shipmentId}: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });

        this.logger.info('routes for shipments successfully configured ✅');
        return app;
    }
}
