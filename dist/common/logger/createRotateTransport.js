"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDailyRotateTransport = createDailyRotateTransport;
const winston_daily_rotate_file_1 = require("winston-daily-rotate-file");
const winston = require("winston");
function createDailyRotateTransport(level, fileName = 'application') {
    return new winston_daily_rotate_file_1.default({
        level,
        dirname: "logs",
        filename: `${fileName}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.simple())
    });
}
//# sourceMappingURL=createRotateTransport.js.map