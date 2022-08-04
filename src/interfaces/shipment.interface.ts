import { Shipment } from "../types/types";

export interface ShipmentServiceDefinition {
    getShipmentById(shipmentId: string): Promise<Shipment | undefined>
    createOrUpdateShipment(shipment: Shipment): void
}