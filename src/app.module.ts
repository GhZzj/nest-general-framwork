import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HttpInterceptor } from './common/interceptors/http.interceptor';
import { FeaturesModule } from './modules/features.module';

@Global()
@Module({
  imports: [DatabaseModule, CommonModule, FeaturesModule],
  controllers: [AppController],
  providers: [AppService,{
      provide:APP_FILTER,
      useClass:AllExceptionFilter
    },{
      provide:APP_INTERCEPTOR,
      useClass:HttpInterceptor
    }],
  exports:[]
})
export class AppModule {}
