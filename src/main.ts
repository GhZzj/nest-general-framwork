import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import  { createLogger } from 'winston';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';

async function bootstrap() {
  const instance = createLogger({
    transports: [
      new winston.transports.Console({//指定在控制台输出
        format: winston.format.combine(winston.format.timestamp(),utilities.format.nestLike())//拼接日志输出的格式
      })
    ]
  })

  const app = await NestFactory.create(AppModule,{
    logger: WinstonModule.createLogger({
      instance
    })
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') as number);
}
bootstrap();