export const SERVICE_TYPES = {
    Main: Symbol.for('Main'),
    ShipmentService: Symbol.for('ShipmentService'),
    OrganizationService: Symbol.for('OrganizationService'),
    Logger: Symbol.for('Logger'),
    ShipmentController: Symbol.for('ShipmentController'),
    OrganizationController: Symbol.for('OrganizationController'),
    DatabaseService: Symbol.for('DatabaseService'),
    WeightConverterService: Symbol.for('WeightConverterService'),
};

export type Organization = {
    orgId: string;
    code: string;
}

export type Node = {
    totalWeight: {
        weight: number | string,
        unit: string,
    }
}

export type TransportPack = {
    nodes: Array<Node>
}

export type Shipment = {
    referenceId: string;
    estimatedTimeArrival?: Date;
    organizations: Array<string>;
    transportPacks: TransportPack;
}
