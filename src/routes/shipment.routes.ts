import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';

export class ShipmentRoutes extends CommonRoutesConfig {
    constructor() {
        super();
    }

    public configureRoutes(app: express.Application): express.Application {

        app.post('/shipment', async (req: any, res: any) => {
        });
        
        app.get('/shipments/:shipmentId', (req: any, res: any) => {
            res.send('Hello World from shipments!');
        });

        return app;
    }
}
