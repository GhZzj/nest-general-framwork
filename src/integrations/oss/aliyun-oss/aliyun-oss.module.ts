import { DynamicModule, Module } from '@nestjs/common';
import { AliyunOssCoreModule } from './aliyun-oss-core.module';
import { AliyunOssModuleAsyncOptions, AliyunOssModuleOptions } from './aliyun-oss.interface';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [AliyunOssModule.forRootAsync({
        useFactory: (configService:ConfigService) => {
            const accessKeyId = configService.get('ALIYUN_OSS_ACCESS_KEY_ID')
            const accessKeySecret = configService.get('ALIYUN_OSS_ACCESS_KEY_SECRET')
            const region = configService.get('ALIYUN_OSS_REGION')
            const bucket = configService.get('ALIYUN_OSS_BUCKET')
            return {
                accessKeyId,
                accessKeySecret,
                region,
                bucket,
            }
        },
        inject: [ConfigService]
    })]
})
export class AliyunOssModule {
    static forRoot(options: AliyunOssModuleOptions): DynamicModule {
        return {
            module: AliyunOssModule,
            imports:[AliyunOssCoreModule.forRoot(options)]
        }
    }
    
    static forRootAsync(options:AliyunOssModuleAsyncOptions): DynamicModule {
        return {
            module: AliyunOssModule,
            imports:[AliyunOssCoreModule.forRootAsync(options)]
        }
    }
}
