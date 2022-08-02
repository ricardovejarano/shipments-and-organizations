import { injectable } from 'inversify';
import { OrganizationServiceDefinition } from '../interfaces/organization.interface';

@injectable()
export class OrganizationService implements OrganizationServiceDefinition{
    constructor() {
        console.log('Hey shipment already created');
    }

    public test(): void {
        console.log('test from in jected service');
    }
}