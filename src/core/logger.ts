import winston from 'winston';

export class Logger {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }

    public getLogger(): winston.Logger {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, service }) => {
                  return `[${timestamp}] ${service} ${level}: ${message}`;
                })
            ),
            defaultMeta: { service: this.name },
            transports: [
                new winston.transports.File({
                  dirname: "logs",
                  filename: "winston_example.log",
                }),
              ],
          });
          
          //
          // If we're not in production then log to the `console` with the format:
          // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
          //
          if (process.env.NODE_ENV !== 'production') {
            logger.add(new winston.transports.Console({
              format: winston.format.simple(),
            }));
          }
        return logger;
    }
}