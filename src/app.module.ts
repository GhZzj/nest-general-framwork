import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/config/config.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService,Logger,{
    provide:APP_FILTER,
    useClass:HttpExceptionFilter
  }],
  exports:[Logger]
})
export class AppModule {}
