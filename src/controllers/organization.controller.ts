import express from 'express';
import winston from 'winston';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { Logger } from '../core/logger';
import { SERVICE_TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { OrganizationService } from '../services/organization.service';
import { Organization } from '../types/types';

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
        
        app.post('/organization', async (req: any, res: any) => {
            if(!req.body.id || !req.body.code) {
                this.logger.warn('⚠️ Missing id or code.  Unable to create/update Organization');
                res.status(400).send('Bad Request'); // TODO: validate response;
            }

            const organization: Organization = {
                orgId: req.body.id,
                code: req.body.code,
            }

            this.logger.info(`🗄️ Processing request to save Organization ${organization.orgId}`);

            try {
                await this.organizationService.createOrUpdateOrganization(organization);
                this.logger.info(`💾 Organization ${organization.orgId} successfully processed`);
                res.status(200).send('Organization successfully processed');
            } catch(e) {
                this.logger.error(`⚠️ Error saving Organization: ${e}`);
                res.status(500).send('Internal Server Error'); // TODO: modify responses
            }
        });
        
        app.get('/organizations/:organizationId', (req: any, res: any) => {
            // TODO: implement
            res.send('Hello World from organizations!');
        });

        this.logger.info('routes for organizations successfully configured ✅');
        return app;
    }
}
