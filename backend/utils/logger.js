const winston = require("winston");
require("winston-daily-rotate-file");

// Define the transport for rotating files
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',  // Keep logs for 14 days
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: "prime-trade-api" },
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
        dailyRotateFileTransport,
    ],
});

module.exports = logger;
