import winston from 'winston';
import { ShipmentServiceDefinition } from "../interfaces/shipment.interface";
import { inject, injectable } from "inversify";
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { Node, Shipment, TransportPack } from '../types/types';
import { PrismaClient } from '@prisma/client';

@injectable()
export class ShipmentService implements ShipmentServiceDefinition {
    private logger: winston.Logger;
    private repository: PrismaClient;

    constructor(@inject(SERVICE_TYPES.Logger) winstonLogger: Logger) {
        this.logger = winstonLogger.getLogger(`[${ShipmentService.name}]`);
        this.repository = new PrismaClient();
    }

    public async createOrUpdateShipment(shipment: Shipment): Promise<void> {
        await this.repository.shipment.upsert({
            where: {
                referenceId: shipment.referenceId,
            },
            create: {
                referenceId: shipment.referenceId,
                estimatedTimeArrival: shipment.estimatedTimeArrival,
                currentOrganizationCodes: shipment.organizations.join(','),
            },
            update: {
                estimatedTimeArrival: shipment.estimatedTimeArrival,
            }
        });

        if(shipment.organizations.length === 0) {
            return;
        }

        await Promise.all(shipment.organizations.map(organizationCode => this.createOrganizationOnShipment(organizationCode, shipment.referenceId)));
        await Promise.all(shipment.transportPacks.nodes.map(node => this.createTransportPacks(node, shipment.referenceId))); // check ounces

    }

    public getShipmentById(): any[] {
        this.logger.info('getShipmentById from in jected service');
        return ['']
    }

    public toTransportPacks(transportPacks: any): TransportPack { // TODO: do not use any
        return {
            nodes: transportPacks.nodes.map((node: any) => ({ totalWeight: { weight:Number(node.totalWeight.weight), unit: node.totalWeight.unit } }))
        }
    }

    private async createOrganizationOnShipment(organizationCode: string, shipmentId: string): Promise<void> {
        const organization = await this.repository.organization.findFirst({
            where: { code: organizationCode }
        });

        if(!organization) {
            return;
        }

        const shipments = await this.repository.organizationsOnShipments.findMany({
            where: {
                AND: [
                    { organizationId: organization.orgId },
                    { organizationCode },
                    { shipmentId }
                ],
            },
            select: {
                organizationId: true,
                organizationCode: true,
            }
        });

        if(shipments.length !== 0) {
            this.logger.info(`Organization ${organizationCode} is already recorded on shipment ${shipmentId}`);
            return;
        }

        await this.repository.organizationsOnShipments.create({
            data: {
                shipmentId,
                organizationId: organization.orgId,
                organizationCode,
            }
        });
    }

    private async createTransportPacks(node: Node, shipmentId: string): Promise<void> {
        await this.repository.transportPacks.create({
            data: {
               shipmentId,
               weight: node.totalWeight.weight,
               unit: node.totalWeight.unit,
            }
        })
    }
}