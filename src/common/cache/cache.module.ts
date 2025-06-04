import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports:[RedisModule.forRoot({
    type:"single",
    url:"redis://localhost:6379",
    options:{
      db:0
    }
  })]
})
export class CacheModule {}
