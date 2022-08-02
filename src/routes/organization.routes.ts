import express from 'express';

import { CommonRoutesConfig } from '../common/common.routes.config';

export class OrganizationRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        
        this.app.post('/organization', (req: any, res: any) => {
        });
        
        this.app.get('/organizations/:organizationId', (req: any, res: any) => {
            res.send('Hello World from organizations!');
        });

        return this.app;
    }
}
