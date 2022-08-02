import 'dotenv/config';
import bodyParser from "body-parser";
import express from 'express';
import winston from "winston";
import { Logger } from './core/logger';
import { SERVICE_TYPES } from "./types";
import { inject, injectable } from "inversify";
import { MainDefinition } from "./interfaces/main.interface";
import { ShipmentRoutes } from './routes/shipment.routes';
import { OrganizationRoutes } from './routes/organization.routes';

@injectable()
export class Main implements MainDefinition {
  private logger: winston.Logger;
  private shipmentRoutes: ShipmentRoutes;
  private organizationRoutes: OrganizationRoutes;

  constructor(
    @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
    @inject(SERVICE_TYPES.ShipmentRoutes) shipmentRoutes: ShipmentRoutes,
    @inject(SERVICE_TYPES.OrganizationRoutes) organizationRoutes: OrganizationRoutes,
  ) {
    this.logger = winstonLogger.getLogger(`[${Main.name}]`);
    this.shipmentRoutes = shipmentRoutes;
    this.organizationRoutes = organizationRoutes;
  }

  public bootstrap(): void {
    this.logger.info('🛠️  Starting application... ');
    let app: express.Application = express();
    app.use(bodyParser.json());
    const port = process.env.PORT ?? 3000;
    this.shipmentRoutes.configureRoutes(app);
    this.organizationRoutes.configureRoutes(app);
  
    app.listen(port, () => {
      this.logger.info(`App listening at http://localhost:${port} 🎉`);
    });
  }
}

