import winston from 'winston';

export interface LoggerDefinition {
    getLogger(name: string): winston.Logger;
}
