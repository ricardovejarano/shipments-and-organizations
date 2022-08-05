import { WeightUnit } from "../services/weight-converter.service";
import { Organization, Shipment } from "../types/types";

export interface ShipmentServiceDefinition {
    getShipmentById(shipmentId: string): Promise<Shipment | undefined>;
    createOrUpdateShipment(shipment: Shipment): void;
    getOrganizationsOnShipment(shipmentId: string): Promise<Array<string>>;
    getOrganizationsWithCodeOnShipment(shipmentId: string): Promise<Array<Organization>>;
    getEstimatedTimeArrival(shipmentId: string): Promise<Date | undefined>;
    getShipmentWeight(shipmentId: string, outputUnit: WeightUnit): Promise<number>;
    getTotalWeight(outputUnit: WeightUnit): Promise<number>;
}