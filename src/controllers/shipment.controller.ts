import express, { Request, Response } from 'express';
import winston from 'winston';
import { SERVICE_TYPES } from '../types';
import { Logger } from '../core/logger';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { ShipmentService } from '../services/shipment.service';
import { Shipment, TransportPack } from '../types/types';
import { WeightUnit } from '../services/weight-converter.service';
import { CustomError } from '../core/custom-error';

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
            try {
                if(!req.body.referenceId) {
                    throw new CustomError(400, '⚠️ Missing referenceId.  Unable to create/update Shipment');
                }
                const estimatedTimeArrival = req.body.estimatedTimeArrival ? new Date(req.body.estimatedTimeArrival) : undefined;
                const shipment: Shipment = {
                    referenceId: req.body.referenceId,
                    estimatedTimeArrival,
                    organizations: req.body.organizations,
                    transportPacks: req.body.transportPacks as TransportPack,
                }

                this.logger.info(`🗄️ Processing request for Shipment ${shipment.referenceId}`);
                await this.shipmentService.createOrUpdateShipment(shipment);
                this.logger.info(`💾 Shipment ${shipment.referenceId} successfully processed`);
                res.status(200).json('Shipment successfully saved');
            } catch(e) {
                const statusCode = e.code ?? 500
                const errorMessage = `⚠️ Error processing Shipment: ${e instanceof Error ? e.message : '<uknown>'}`; 
                this.logger.error(errorMessage);
                res.status(statusCode).json({ statusCode, message: errorMessage });
            }
        });
        
        app.get('/shipments/:shipmentId', async (req: Request, res: Response) => {
            try {
                const shipmentId = req.params.shipmentId;
                const shipment = await this.shipmentService.getShipmentById(shipmentId);
                res.json(shipment  ?? `shipment ${shipmentId} not found`);
            } catch(e) {
                const errorMessage = `⚠️ Error getting Shipment ${req.params.shipmentId}: ${e instanceof Error ? e.message : '<uknown>'}`;
                this.logger.error(errorMessage);
                res.status(500).json({ statusCode: 500, message: errorMessage });
            }
            
        });

        /**
         * Returns all the organizations tracked per each shipment
         */
        app.get('/shipments/organizations/:shipmentId', async (req: Request, res: Response) => {
            try {
                const organizationsOnShipment = await this.shipmentService.getOrganizationsOnShipment( req.params.shipmentId );
                res.json(organizationsOnShipment);
            } catch(e) {
                const errorMessage = `⚠️ Error getting organizations on shipment ${req.params.shipmentId}: ${e instanceof Error ? e.message : '<uknown>'}`;
                this.logger.error(errorMessage);
                res.status(500).json({ statusCode: 500, message: errorMessage });
            }
        });

        app.get('/shipments/organizations-with-code/:shipmentId', async (req: Request, res: Response) => {
            try {
                const organizationsOnShipment = await this.shipmentService.getOrganizationsWithCodeOnShipment( req.params.shipmentId );
                res.json(organizationsOnShipment);
            } catch(e) {
                const errorMessage = `⚠️ Error getting Organizations with code on Shipment ${req.params.shipmentId}: ${e instanceof Error ? e.message : '<uknown>'}`;
                this.logger.error(errorMessage);
                res.status(500).json({ statusCode: 500, message: errorMessage });
            }
        });

        app.get('/shipments/estimated-time-arrival/:shipmentId', async (req: Request, res: Response) => {
            try {
                const timeArrival = await this.shipmentService.getEstimatedTimeArrival( req.params.shipmentId );
                res.json({ estimatedTimeArrival: timeArrival ?? 'unknown' });
            } catch(e) {
                const errorMessage = `⚠️ Error getting time arrival for thipment ${req.params.shipmentId}: ${e instanceof Error ? e.message : '<uknown>'}`;
                this.logger.error(errorMessage);
                res.status(500).json({ statusCode: 500, message: errorMessage });
            }
        });

        app.get('/shipments/shipment-weight/:shipmentId/:units', async (req: Request, res: Response) => {
            const shipmentId = req.params.shipmentId;
            const units = req.params.units;

            try {
                if(!shipmentId || !units) {
                    throw new CustomError(400, `⚠️ Missing shipmentId or units`);
                }
                
                if (!Object.values(WeightUnit).includes(units as WeightUnit)) {
                    throw new CustomError(400, `⚠️ Invalid units ${units}`);
                }

                const totalWeight = await this.shipmentService.getShipmentWeight(shipmentId, units as WeightUnit);
                res.status(200).json({ totalWeight: totalWeight , units });
            } catch(e) {
                const statusCode = e.code ?? 500
                const errorMessage = `⚠️ Error getting total weight for shipment ${req.params.shipmentId}: ${e instanceof Error ? e.message : '<uknown>'}`; 
                this.logger.error(errorMessage);
                res.status(statusCode).json({ statusCode, message: errorMessage });
            }
        });

        app.get('/shipments/total-weight/:units', async (req: Request, res: Response) => {
            const units = req.params.units;

            try {
                if (!units || !Object.values(WeightUnit).includes(units as WeightUnit)) {
                    throw new CustomError(400, `Invalid units: ${units}.  Unable to get total weight`);
                }

                const totalWeight = await this.shipmentService.getTotalWeight(units as WeightUnit);
                res.status(200).json({ totalWeight: totalWeight , units });
            } catch(e) {
                const statusCode = e.code ?? 500
                const errorMessage = `⚠️ Error getting total weight: ${e instanceof Error ? e.message : '<uknown>'}`; 
                this.logger.error(errorMessage);
                res.status(statusCode).json({ statusCode, message: errorMessage });
            }
        });

        this.logger.info('routes for shipments successfully configured ✅');
        return app;
    }
}
