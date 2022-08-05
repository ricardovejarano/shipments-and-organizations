import { LoggerDefinition } from '../interfaces/logger.interface';
import winston from 'winston';
import { injectable } from 'inversify';

@injectable()
export class Logger implements LoggerDefinition {

    public getLogger(serviceName: string): winston.Logger {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, service }) => {
                  return `[${timestamp}] ${service} ${level}: ${message}`;
                })
            ),
            defaultMeta: { service: serviceName },
            transports: [
                new winston.transports.File({
                  dirname: "logs",
                  filename: "winston_example.log",
                }),
              ],
          });
          
          // for non production env, log to the `console` 
          if (process.env.NODE_ENV !== 'production') {
            logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf(({ timestamp, level, message, service }) => {
                    return `[${timestamp}] ${service} ${level}: ${message}`;
                    }),
                ),
            }));
          }
        return logger;
    }
}