import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import DbConfig from './db-config';

const envLoads:any[]=[]

envLoads.push(()=>dotenv.config({ path: '.env' ,override:true })) //加载默认的.env文件
envLoads.push(DbConfig) //加载db-config.ts文件中的配置

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`, //根据环境变量加载不同的.env文件
      load: [
        ...envLoads, // 加载更多的自定义配置文件
      ],
      validationSchema: Joi.object({
        MYNAME:Joi.string().default("你的名字")
      }),
    }),
  ],
})

export class ConfigModule {}
