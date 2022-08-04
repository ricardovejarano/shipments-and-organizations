export type Organization = {
    orgId: string;
    code: string;
}

export type Shipment = {
    referenceId: string;
    estimatedTimeArrival?: Date;
    organizations: Array<string>;
}
