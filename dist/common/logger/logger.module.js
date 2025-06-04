"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const config_1 = require("@nestjs/config");
const createRotateTransport_1 = require("./createRotateTransport");
let LoggerModule = class LoggerModule {
};
exports.LoggerModule = LoggerModule;
exports.LoggerModule = LoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    let transportArr = [];
                    console.log(configService.get('LOG_ON'));
                    let logType = configService.get('LOG_Type');
                    if (logType == 'mongo') {
                        const defaultOptions = {
                            db: configService.get('LOG_DB'),
                            collection: configService.get('LOG_COLLECTION'),
                            level: configService.get('LOG_LEVEL'),
                            capped: configService.get('LOG_CAPPED') === "true",
                            cappedSize: +configService.get('LOG_CAPPED_SIZE'),
                            cappedMax: +configService.get('LOG_CAPPED_MAX'),
                            storeHost: configService.get('LOG_STORE_HOST') === 'true',
                        };
                        transportArr = [];
                    }
                    else if (logType == 'file') {
                        transportArr = [
                            (0, createRotateTransport_1.createDailyRotateTransport)('info', 'application'),
                            (0, createRotateTransport_1.createDailyRotateTransport)('warn', 'error'),
                        ];
                    }
                    return {
                        transports: transportArr
                    };
                }
            })
        ]
    })
], LoggerModule);
//# sourceMappingURL=logger.module.js.map