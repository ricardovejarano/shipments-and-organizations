import { Shipment } from "../types/types";

export interface ShipmentServiceDefinition {
    getShipmentById(): Array<any>; // TODO: define the type of the return value
    createOrUpdateShipment(shipment: Shipment): void
}