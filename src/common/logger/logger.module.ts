import { Module } from '@nestjs/common';
import {WinstonModule} from "nest-winston";
import {ConfigService} from "@nestjs/config";
import { createDailyRotateTransport } from './createRotateTransport';

@Module({
    imports:[
        WinstonModule.forRootAsync({
            inject:[ConfigService],
            useFactory: async (configService: ConfigService) => {
                let transportArr:any[]=[]
                console.log(configService.get('LOG_ON'))
                let logType = configService.get('LOG_Type')
                if(logType == 'mongo'){
                    //mongo transport
                    const defaultOptions = {
                        db: configService.get('LOG_DB'),
                        collection: configService.get('LOG_COLLECTION'),
                        level: configService.get('LOG_LEVEL'),
                        capped: configService.get('LOG_CAPPED')==="true",
                        cappedSize: +configService.get('LOG_CAPPED_SIZE'),
                        cappedMax: +configService.get('LOG_CAPPED_MAX'),
                        storeHost: configService.get('LOG_STORE_HOST')==='true',
                    }
                    transportArr= []
                }else if(logType=='file'){
                    transportArr=[
                        createDailyRotateTransport('info', 'application'),
                        createDailyRotateTransport('warn', 'error'),
                    ]
                }
                return{
                    transports:transportArr
                }
            }
        })
    ]
})
export class LoggerModule {}
