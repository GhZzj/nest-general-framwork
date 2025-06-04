import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/config/config.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from './common/logger/logger.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { CacheModule } from './common/cache/cache.module';

@Global()
@Module({
  imports: [ConfigModule,LoggerModule, CacheModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide:APP_FILTER,
      useClass:AllExceptionFilter
    },{
    provide:APP_FILTER,
    useClass:HttpExceptionFilter
    }],
  exports:[]
})
export class AppModule {}
