import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HttpInterceptor } from './common/interceptors/http.interceptor';
import { FeaturesModule } from './modules/features.module';
import { UtilsModule } from './utils/utils.module';
import { SshModule } from './utils/ssh/ssh.module';

@Global()
@Module({
  imports: [DatabaseModule, CommonModule, FeaturesModule, UtilsModule,
   /* SshModule.forRootAsync({
      useFactory: () => ({
        username:"root",
        password:"123456",
        host:"192.168.92.128",
        port:22,
      })
    },"SSH_SERVICE")*/
  ],
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
