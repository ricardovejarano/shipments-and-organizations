export type Organization = {
    orgId: string;
    code: string;
}

export type Node = {
    totalWeight: {
        weight: number,
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
