import express, { Request, Response } from 'express';
import winston from 'winston';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { OrganizationService } from '../services/organization.service';
import { Organization } from '../types/types';
import { CustomError } from '../core/custom-error';

@injectable()
export class OrganizationController implements ControllerDefinition {
    private logger: winston.Logger;
    private organizationService: OrganizationService;

    constructor(
        @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
        @inject(SERVICE_TYPES.OrganizationService) organizationService: OrganizationService
    ) {
        this.logger = winstonLogger.getLogger(`[${OrganizationController.name}]`);
        this.organizationService = organizationService;
    }

    configureRoutes(app: express.Application): express.Application {
        
        app.post('/organization', async (req: Request, res: Response) => {
            try {
                if(!req.body.id || !req.body.code) {
                    throw new CustomError(400, '⚠️ Missing id or code.  Unable to create/update Organization');
                }

                const organization: Organization = {
                    orgId: req.body.id,
                    code: req.body.code,
                }

                this.logger.info(`🗄️ Processing request to save Organization ${organization.orgId}`);

                await this.organizationService.createOrUpdateOrganization(organization);
                this.logger.info(`💾 Organization ${organization.orgId} successfully processed`);
                res.status(200).json('Organization successfully processed');
            } catch(e) {
                const statusCode = e.code ?? 500
                const errorMessage = `⚠️ Error processing organization: ${e instanceof Error ? e.message : '<uknown>'}`; 
                this.logger.error(errorMessage);
                res.status(statusCode).json({ statusCode, message: errorMessage });
            }
        });
        
        app.get('/organizations/:organizationId', async (req: Request, res: Response) => {
            try {
                const organizationId = req.params.organizationId
                const organization = await this.organizationService.getOrganizationById(organizationId);
                this.logger.info(`💾 Organization ${organization?.orgId} found: ${JSON.stringify(organization)}`);
                res.json(organization ?? `organization ${organizationId} not found`);
            } catch(e) {
                const errorMessage = `⚠️ Error gettuing organization ${req.params.organizationId}: ${e instanceof Error ? e.message : '<uknown>'}`; 
                res.status(500).json({ statusCode: 500, message: errorMessage });
            }
        });

        this.logger.info('routes for organizations successfully configured ✅');
        return app;
    }
}
