import express from 'express';
import bodyParser from "body-parser";
// import { ShipmentRoutes } from './routes/shipment.routes';
// import { OrganizationRoutes } from './routes/organization.routes';
import { Logger } from './core/logger';
import 'dotenv/config';
import { SERVICE_TYPES } from "./types";
import winston from "winston";
import { inject, injectable } from "inversify";
import { MainDefinition } from "./interfaces/main.interface";
import { ShipmentRoutes } from './routes/shipment.routes';

@injectable()
export class Main implements MainDefinition {
  private logger: winston.Logger;
  private shipmentRoutes: ShipmentRoutes;

  constructor(
    @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
    @inject(SERVICE_TYPES.ShipmentRoutes) shipmentRoutes: ShipmentRoutes,
  ) {
    this.logger = winstonLogger.getLogger(`[${Main.name}]`);
    this.shipmentRoutes = shipmentRoutes;
  }

  public bootstrap(): void {
    this.logger.info('🛠️  Starting application... ');
    let app: express.Application = express();
    app.use(bodyParser.json());
    const port = process.env.PORT ?? 3000;
    this.shipmentRoutes.configureRoutes(app);
    // const shipmentRoutes = new ShipmentRoutes();
    // shipmentRoutes.configureRoutes(app);
  
    // const organizationRoutes = new OrganizationRoutes();
    // organizationRoutes.configureRoutes(app);
  
    app.listen(port, () => {
      this.logger.info(`Example app listening at http://localhost:${port}`);
    });
  }
}

