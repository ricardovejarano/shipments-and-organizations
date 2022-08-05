import 'dotenv/config';
import bodyParser from "body-parser";
import express from 'express';
import winston from "winston";
import { Logger } from './core/logger';
import { SERVICE_TYPES } from "./types";
import { inject, injectable } from "inversify";
import { MainDefinition } from "./interfaces/main.interface";
import { ShipmenController } from './controllers/shipment.controller';
import { OrganizationController } from './controllers/organization.controller';
import { PrismaClient } from '@prisma/client';
import { Middlewares } from './middlewares/middlewares';

@injectable()
export class Main implements MainDefinition {
  private logger: winston.Logger;
  private shipmentController: ShipmenController;
  private organizationController: OrganizationController;
  private repository: PrismaClient;
  private middleware: Middlewares;

  constructor(
    @inject(SERVICE_TYPES.Logger) winstonLogger: Logger,
    @inject(SERVICE_TYPES.ShipmentController) shipmentController: ShipmenController,
    @inject(SERVICE_TYPES.OrganizationController) organizationController: OrganizationController,
  ) {
    this.logger = winstonLogger.getLogger(`[${Main.name}]`);
    this.shipmentController = shipmentController;
    this.organizationController = organizationController;
    this.repository = new PrismaClient();
    this.middleware = new Middlewares();
  }

  public async bootstrap(): Promise<void> {
    this.logger.info('🛠️  Starting application... ');
    const app: express.Application = express();
    app.use(bodyParser.json());
    app.use(this.middleware.trackRequest);
    const port = process.env.PORT ?? 3000;
    this.shipmentController.configureRoutes(app);
    this.organizationController.configureRoutes(app);
    await this.repository.$connect();
    this.logger.info(`Database running 📊`);
  
    app.listen(port, () => {
      this.logger.info(`App listening at http://localhost:${port} 🎉`);
    });

    process.on('SIGINT', async () => {
      await this.repository.$disconnect();
      this.logger.info('🛑  Application stopped.');
      process.exit();
  });
  }
}

