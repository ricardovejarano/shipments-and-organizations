import "reflect-metadata";
import 'dotenv/config';
import { container } from "./src/core/inversify.config";
import { MainDefinition } from "./src/interfaces/main.interface";
import { SERVICE_TYPES } from "./src/types";


const main = container.get<MainDefinition>(SERVICE_TYPES.Main);
main.bootstrap();
