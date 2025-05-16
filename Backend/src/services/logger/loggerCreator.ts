import winston from "winston";
import * as url from "node:url";
import * as fs from 'node:fs'
import * as path from "node:path";
const { combine, timestamp,colorize,align,printf,errors } = winston.format;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const logPath = path.join(__dirname,'..','..','..','..','logs')
let pathExists = false

if(!pathExists && !fs.existsSync(logPath)) {
    fs.mkdirSync(logPath)
    pathExists = true
    console.log("Logs folder not found creating a new one")
}

enum LoggerLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    HTTP = "http",
    VERBOSE = "verbose",
    DEBUG = "debug",
    SILLY = "silly",
}

const format = combine(
    colorize({ all: true }),
    errors({stack:true}),
    timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => {
        return info.stack
            ? `\n[${info.timestamp}] ${info.level}: ${info.message}${info.stack ? `\nStack Trace - ${info.stack}` : ''}`
            :  `[${info.timestamp}] ${info.level}: ${info.message}`;
    })
)

// TODO need to add Daily File exports manually to all the loggers
const transports = [new winston.transports.Console({
    level: LoggerLevel.SILLY,
})]

const createLogger = (level:LoggerLevel) => {
    return winston.createLogger({
        level,
        format,
        transports
    })
}

/**
 * LoggerCreator class provides separate Winston loggers for each log level.
 * Each logger can be accessed independently to log messages of that level.
 *
 * Levels supported:
 * - error
 * - warn
 * - info
 * - http
 * - verbose
 * - debug
 * - silly
 */
export class LoggerCreator{
    private errorLogger = createLogger(LoggerLevel.ERROR)
    private warnLogger = createLogger(LoggerLevel.WARN)
    private infoLogger = createLogger(LoggerLevel.INFO)
    private httpLogger = createLogger(LoggerLevel.HTTP)
    private verboseLogger = createLogger(LoggerLevel.VERBOSE)
    private debugLogger = createLogger(LoggerLevel.DEBUG)
    private sillyLogger = createLogger(LoggerLevel.SILLY)

    /**
     * Returns the Winston logger configured for 'error' level logs.
     */
    public getErrorLogger(){
        return this.errorLogger
    }

    /**
     * Returns the Winston logger configured for 'warn' level logs.
     */
    public getWarnLogger(){
        return this.warnLogger
    }

    /**
     * Returns the Winston logger configured for 'info' level logs.
     */
    public getInfoLogger(){
        return this.infoLogger
    }

    /**
     * Returns the Winston logger configured for 'http' level logs.
     */
    public getHttpLogger(){
        return this.httpLogger
    }

    /**
     * Returns the Winston logger configured for 'verbose' level logs.
     */
    public getVerboseLogger(){
        return this.verboseLogger
    }

    /**
     * Returns the Winston logger configured for 'debug' level logs.
     */
    public getDebugLogger(){
        return this.debugLogger
    }

    /**
     * Returns the Winston logger configured for 'silly' level logs.
     */
    public getSillyLogger(){
        return this.sillyLogger
    }
}