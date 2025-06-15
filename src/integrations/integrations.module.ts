import { Module } from '@nestjs/common';
import { MinioModule } from './oss/minio/minio.module';

@Module({
  imports: [MinioModule]
})
export class IntegrationsModule {}
