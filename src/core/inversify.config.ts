import { Container } from 'inversify';
import "reflect-metadata";
import { SERVICE_TYPES } from '../types';
import { ShipmentService } from '../services/shipment.service';
import { ShipmentServiceDefinition } from '../interfaces/shipment.interface';
import { Logger } from './logger';
import { LoggerDefinition } from '../interfaces/logger.interface';
import { Main } from '../main';
import { MainDefinition } from 'src/interfaces/main.interface';


export const container = new Container();
container.bind<MainDefinition>(SERVICE_TYPES.Main).to(Main);
container.bind<LoggerDefinition>(SERVICE_TYPES.Logger).to(Logger);
container.bind<ShipmentServiceDefinition>(SERVICE_TYPES.ShipmentService).to(ShipmentService);
