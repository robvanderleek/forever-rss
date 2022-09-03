const winston = require('winston');

const logFormat = winston.format.combine(
    winston.format(info => {
        info.level = info.level.toUpperCase()
        return info;
    })(),
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level.toString()}: ${info.message}`)
);

export const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console()
    ],
});