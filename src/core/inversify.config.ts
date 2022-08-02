import { Container } from 'inversify';
import "reflect-metadata";
import { SERVICE_TYPES } from '../types';
import { ShipmentService } from '../services/shipment.service';
import { ShipmentServiceDefinition } from '../interfaces/shipment.interface';
import { Logger } from './logger';
import { LoggerDefinition } from '../interfaces/logger.interface';
import { Main } from '../main';
import { MainDefinition } from '../interfaces/main.interface';
import { ControllerDefinition } from '../interfaces/controller.interface';
import { ShipmenController } from '../controllers/shipment.controller';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';
import { OrganizationServiceDefinition } from '../interfaces/organization.interface';


export const container = new Container();
container.bind<MainDefinition>(SERVICE_TYPES.Main).to(Main);
container.bind<LoggerDefinition>(SERVICE_TYPES.Logger).to(Logger);
container.bind<ShipmentServiceDefinition>(SERVICE_TYPES.ShipmentService).to(ShipmentService);
container.bind<OrganizationServiceDefinition>(SERVICE_TYPES.OrganizationService).to(OrganizationService);
container.bind<ControllerDefinition>(SERVICE_TYPES.ShipmentController).to(ShipmenController);
container.bind<ControllerDefinition>(SERVICE_TYPES.OrganizationController).to(OrganizationController);
