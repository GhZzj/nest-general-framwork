import { Module } from '@nestjs/common';
import {WinstonModule} from "nest-winston";
import {ConfigService} from "@nestjs/config";
import { createConsoleTransport, createDailyRotateTransport, createMongodbTransport } from './createRotateTransport';
import { MongoDBConnectionOptions } from 'winston-mongodb';

@Module({
    imports:[
        WinstonModule.forRootAsync({
            inject:[ConfigService],
            useFactory: async (configService: ConfigService) => {
                let transportArr:any[]=[]
                transportArr=[
                    createDailyRotateTransport('info', 'application'),
                    createDailyRotateTransport('warn', 'error'),
                    createConsoleTransport(),//控制台日志
                ]

                //添加mongodb日志记录
                const logOnMongodb = configService.get('LOG_ON_MONGODB')
                if(logOnMongodb){
                    const mongoOptions= {
                        db:configService.get('LOG_MONGO_DB'),
                        collection:configService.get('LOG_MONGO_COLLECTION'),
                        level:configService.get('LOG_MONGO_LEVEL'),
                        capped:configService.get('LOG_MONGO_CAPPED'),
                        cappedSize:+configService.get('LOG_MONGO_CAPPED_SIZE'),
                        cappedMax:+configService.get('LOG_MONGO_CAPPED_MAX'),
                        storeHost:configService.get('LOG_MONGO_STORE_HOST'),
                    } as MongoDBConnectionOptions
                    transportArr.push(createMongodbTransport(mongoOptions))
                }

                return {
                    transports:transportArr
                }
            }
        })
    ]
})
export class LoggerModule {}
