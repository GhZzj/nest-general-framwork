"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const winston_1 = require("winston");
const winston = require("winston");
const nest_winston_1 = require("nest-winston");
async function bootstrap() {
    const instance = (0, winston_1.createLogger)({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike())
            })
        ]
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger({
            instance
        })
    });
    const configService = app.get(config_1.ConfigService);
    await app.listen(configService.get('PORT'));
}
bootstrap();
//# sourceMappingURL=main.js.map