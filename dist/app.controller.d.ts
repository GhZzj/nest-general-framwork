import { Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from "@nestjs/config";
export declare class AppController {
    private readonly appService;
    configService: ConfigService;
    logger: Logger;
    constructor(appService: AppService);
    getHello(): string;
}
