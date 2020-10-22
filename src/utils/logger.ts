import moment from "moment";
import winston from "winston";
import os from "os";
import path from "path";
import fs from "fs";
import ENV from "./env";
import DailyRotateFile from "winston-daily-rotate-file";
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const dailyRotateFileTransport = new DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "100k",
  maxFiles: "14d"
});
const logger = winston.createLogger({
  exitOnError: false,
  level: "info",
  transports: [dailyRotateFileTransport]
});

const { combine, prettyPrint, colorize, printf, label } = winston.format;
const msgFormat = printf(info => `${moment().format("D MMM HH:mm")} [${info.label}] ${info.level}:\n${info.message}`);
const consoleFormat = combine(label({ label: os.hostname() }), prettyPrint(), colorize({ all: true }), msgFormat);
if (["sit", "uat", "production"].includes(ENV.NODE_ENV)) {
  // Cloud services
} else {
  logger.add(new winston.transports.Console({ level: "debug", format: consoleFormat }));
}

export default logger;
