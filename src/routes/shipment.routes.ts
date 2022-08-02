import express from 'express';
import { shipments } from '../controllers/shipment.controller';


import { CommonRoutesConfig } from '../common/common.routes.config';

export class ShipmentRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {

        this.app.post('/shipment', async (req: any, res: any) => {
        });
        
        this.app.get('/shipments/:shipmentId', (req: any, res: any) => {
            res.send('Hello World from shipments!');
        });

        return this.app;
    }
}
