import express from 'express';

import { CommonRoutesConfig } from '../common/common.routes.config';

export class OrganizationRoutes extends CommonRoutesConfig {
    constructor() {
        super();
    }

    configureRoutes(app: express.Application): express.Application {
        
        app.post('/organization', (req: any, res: any) => {
        });
        
        app.get('/organizations/:organizationId', (req: any, res: any) => {
            res.send('Hello World from organizations!');
        });

        return app;
    }
}
