import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import  { createLogger } from 'winston';
import * as winston from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))//使用winston Logger
  app.enableShutdownHooks()
  //全局类验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, //去除类上不存在的字段
    transform:true, //将请求参数转换为dto对象
    transformOptions:{
      enableImplicitConversion:true //允许隐式转换
    }
  }))
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') as number);
}

bootstrap();