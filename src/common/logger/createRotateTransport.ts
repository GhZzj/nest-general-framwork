import  DailyRotateFile from "winston-daily-rotate-file";
import { MongoDB, MongoDBConnectionOptions } from "winston-mongodb";
import * as winston from "winston";
/**
 * 创建每天轮转的日志记录器 记录文件保存到logs文件夹下
 * @param level
 * @param fileName
 */
export function createDailyRotateTransport(level:string,fileName='application'){
    return new DailyRotateFile({
        level,
        dirname:"logs",
        filename:`${fileName}-%DATE%.log`,
        datePattern:"YYYY-MM-DD",
        zippedArchive:true,
        maxSize:"20m",
        maxFiles:"14d",
        format:winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.simple()
        )
    })
}


/**
 * 创建mongodb日志记录器
 * @param options 
 * @returns 
 */
export const createMongodbTransport = (options:MongoDBConnectionOptions)=>{
    return new MongoDB(options)
}

//创建一个console的日志记录
export const createConsoleTransport = ()=>{
    return new winston.transports.Console({
        level:"error",
        format:winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.simple()
        )
    })
}