import express from 'express';
import bodyParser from "body-parser";
import { ShipmentRoutes } from './src/routes/shipment.routes';
import { OrganizationRoutes } from './src/routes/organization.routes';
import 'dotenv/config'

function bootstrap(): void {
  let app: express.Application = express()
  app.use(bodyParser.json());
  const port = 3000
  
  const shipmentRoutes = new ShipmentRoutes(app);
  shipmentRoutes.configureRoutes();

  const organizationRoutes = new OrganizationRoutes(app);
  organizationRoutes.configureRoutes();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
}

bootstrap();
