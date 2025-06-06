import { Module } from '@nestjs/common';
import { CacheModule } from '@/common/cache/cache.module';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports:[CacheModule,ConfigModule,LoggerModule]
})
export class CommonModule {}
