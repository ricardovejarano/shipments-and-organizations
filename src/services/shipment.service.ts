import winston from 'winston';
import { ShipmentServiceDefinition } from "../interfaces/shipment.interface";
import { inject, injectable } from "inversify";
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { Shipment } from '../types/types';

@injectable()
export class ShipmentService implements ShipmentServiceDefinition {
    private logger: winston.Logger;

    constructor(@inject(SERVICE_TYPES.Logger) winstonLogger: Logger) {
        this.logger = winstonLogger.getLogger(`[${ShipmentService.name}]`);
    }

    public createOrUpdateShipment(shipment: Shipment): void {
        this.logger.info(JSON.stringify(shipment));
    }

    public getShipmentById(): any[] {
        this.logger.info('getShipmentById from in jected service');
        return ['']
    }
}