import { ShipmentServiceDefinition } from "../interfaces/shipment.interface";
import { injectable } from "inversify";

@injectable()
export class ShipmentService implements ShipmentServiceDefinition {
    constructor() {
    }

    public getShipmentById(): any[] {
        return ['']
    }
}