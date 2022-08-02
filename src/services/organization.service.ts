import winston from 'winston';
import { inject, injectable } from 'inversify';
import { OrganizationServiceDefinition } from '../interfaces/organization.interface';
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';

@injectable()
export class OrganizationService implements OrganizationServiceDefinition{
    private logger: winston.Logger;

    constructor(@inject(SERVICE_TYPES.Logger) winstonLogger: Logger) {
        this.logger = winstonLogger.getLogger(`[${OrganizationService.name}]`);
    }

    public test(): void {
        this.logger.info('test from in jected service');
    }
}