import { Module } from '@nestjs/common';
import { MinioModule } from './oss/minio/minio.module';
import { AliyunOssModule } from './oss/aliyun-oss/aliyun-oss.module';

@Module({
  imports: [MinioModule, AliyunOssModule]
})
export class IntegrationsModule {}
