import winston from 'winston';
import { inject, injectable } from 'inversify';
import { OrganizationServiceDefinition } from '../interfaces/organization.interface';
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { Organization } from '../types/types';
import { Organization as OrganizationPrisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';

@injectable()
export class OrganizationService implements OrganizationServiceDefinition{
    private logger: winston.Logger;
    private repository: PrismaClient;

    constructor(@inject(SERVICE_TYPES.Logger) winstonLogger: Logger) {
        this.logger = winstonLogger.getLogger(`[${OrganizationService.name}]`);
        this.repository = new PrismaClient();
    }

    public async createOrUpdateOrganization(organization: Organization): Promise<OrganizationPrisma> {
        return this.repository.organization.upsert({
            where: {
                orgId: organization.orgId,
            },
            create: {
                orgId: organization.orgId,
                code: organization.code,
            },
            update: {
                code: organization.code,
            }
        });
    }
}