import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller()
export class AppController {
  @Inject(ConfigService)
  configService: ConfigService;
  @InjectRedis()
  private readonly redis: Redis;

  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    const res = await this.redis.get("token")
    return res
  }
}
