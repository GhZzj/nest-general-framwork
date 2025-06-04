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
                transportArr=[
                    createDailyRotateTransport('info', 'application'),
                    createDailyRotateTransport('warn', 'error'),
                ]
                return {
                    transports:transportArr
                }
            }
        })
    ]
})
export class LoggerModule {}
