import { Module } from '@nestjs/common';
import { CacheModule } from '@/common/cache/cache.module';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports:[CacheModule,ConfigModule,LoggerModule, CronModule]
})
export class CommonModule {}
