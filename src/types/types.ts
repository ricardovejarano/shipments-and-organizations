export type Organization = {
    orgId: string;
    code: string;
}

export type Shipment = {
    referenceId: string;
    estimatedTimeArrival?: string;
    organizations: Array<string>;
}
