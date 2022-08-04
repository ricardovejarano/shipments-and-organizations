import winston from 'winston';
import { ShipmentServiceDefinition } from "../interfaces/shipment.interface";
import { inject, injectable } from "inversify";
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { Node, Organization, Shipment } from '../types/types';
import { PrismaClient } from '@prisma/client';
import { WeightConverterService, WeightUnit } from './weight-converter.service';

@injectable()
export class ShipmentService implements ShipmentServiceDefinition {
    private logger: winston.Logger;
    private repository: PrismaClient;
    private weightConverterService: WeightConverterService;

    constructor(
        @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
        @inject(SERVICE_TYPES.WeightConverterService) weightConverterService: WeightConverterService
    ) {
        this.logger = winstonLogger.getLogger(`[${ShipmentService.name}]`);
        this.repository = new PrismaClient();
        this.weightConverterService = weightConverterService;
    }

    public async getShipmentById(shipmentId: string): Promise<Shipment | undefined> {
        const record = await this.repository.shipment.findFirst({
            where: { referenceId: shipmentId },
        });

        if(!record) {
            return;
        }

        // assuming one node sent per shipment snapshot 
        const transportPack = await this.repository.transportPacks.findFirst({
            where: { shipmentId },
            orderBy: {createdAt: 'desc'},
        });

        let nodes: Array<Node> = [];
        if(transportPack){
            nodes = [{ totalWeight: { weight: transportPack.weight.toString(), unit: transportPack.unit } }];
        }

        let organizations: Array<string> = [];
        if(record.currentOrganizationCodes) {
            organizations = record.currentOrganizationCodes.split(',');
        }

        return { referenceId: shipmentId, estimatedTimeArrival: record.estimatedTimeArrival ?? undefined, organizations, transportPacks: { nodes } };
    }

    public async getOrganizationsOnShipment(shipmentId: string): Promise<Array<string>> {
        const record = await this.repository.organizationsOnShipments.findMany({
            where: { shipmentId },
            select: { organizationId: true },
        });

        const keys = record.map(({ organizationId }) => organizationId);

        return [...new Set(keys)];
    }

    public async getOrganizationsWithCodeOnShipment(shipmentId: string): Promise<Array<Organization>> {
        const record = await this.repository.organizationsOnShipments.findMany({
            where: { shipmentId },
            select: {
                organizationId: true,
                organizationCode: true,
            }
        });

        return record.map(({ organizationId, organizationCode }) => ({ orgId: organizationId, code: organizationCode }));
    }

    public async getEstimatedTimeArrival(shipmentId: string): Promise<Date | undefined> {
        const record = await this.repository.shipment.findFirst({
            where: { referenceId: shipmentId },
            select: { estimatedTimeArrival: true },
        });
        return record?.estimatedTimeArrival ?? undefined;
    }

    public async getShipmentWeight(shipmentId: string, outputUnit: WeightUnit): Promise<number> {
        const record = await this.repository.transportPacks.findMany({
            where: { shipmentId },
            select: { weight: true, unit: true },
        });

        return Math.round(this.toTotalWeightInUnits(record, outputUnit) * 100) / 100;
    }

    public async getTotalWeight(outputUnit: WeightUnit): Promise<number> {
        const record = await this.repository.transportPacks.findMany({
            select: { weight: true, unit: true },
        });

        return Math.round(this.toTotalWeightInUnits(record, outputUnit) * 100) / 100;
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
                currentOrganizationCodes: shipment.organizations.join(','),
            }
        });

        // create records for OrganizationsOnShipment and transportPacks associated with this shipment
        await Promise.all(
            [
                shipment.organizations.map(organizationCode => this.createOrganizationOnShipment(organizationCode, shipment.referenceId)),
                shipment.transportPacks.nodes.map(node => this.createTransportPacks(node, shipment.referenceId))
            ]
        );
    }

    private async createOrganizationOnShipment(organizationCode: string, shipmentId: string): Promise<void> {
        const organization = await this.repository.organization.findFirst({
            where: { code: organizationCode }
        });

        if(!organization) {
            return;
        }

        const shipments = await this.repository.organizationsOnShipments.findFirst({
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

        // to avoid duplicates (this is another assumption though)
        if(shipments) {
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
        const record = await this.repository.transportPacks.findFirst({
            where: {
                AND: [
                    { shipmentId },
                    { weight: Number(node.totalWeight.weight) },
                    { unit: node.totalWeight.unit },
                ]
            }
        });

        // to avoid duplicates 
        if(record) {
            this.logger.info(`ℹ️  Transport pack with weight ${node.totalWeight.weight} ${node.totalWeight.unit} is already recorded on shipment ${shipmentId}`);
            return;
        }

        await this.repository.transportPacks.create({
            data: {
               shipmentId,
               weight: Number(node.totalWeight.weight),
               unit: node.totalWeight.unit,
            }
        });
    }

    private toTotalWeightInUnits(record: Array<{ unit: string, weight: number }>, outputUnit: WeightUnit): number {
        return record.reduce((acc, { weight, unit }) => {
            return acc + this.weightConverterService.convert(weight, unit.toLocaleLowerCase() as WeightUnit, outputUnit);
        }, 0);
    }
}