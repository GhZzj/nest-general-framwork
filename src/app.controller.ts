import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from "@nestjs/config";
import * as process from 'node:process';

@Controller()
export class AppController {
  @Inject(ConfigService)
  configService: ConfigService;
  @Inject(Logger)
  logger: Logger;
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log(this.configService.get('MYNAME'));
    return this.appService.getHello();
  }
}
