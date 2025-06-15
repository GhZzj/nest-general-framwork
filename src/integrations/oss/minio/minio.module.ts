import { DynamicModule,Module } from '@nestjs/common';
import { MinioModuleAsyncOptions, MinioModuleOptions } from './minio.interface';
import { MinioCoreModule } from './mino-core.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[MinioModule.forRootAsync({
      useFactory:(config:ConfigService)=>{
        return {
            endPoint: config.get<string>('MINIO_HOST')||'localhost',
            port: config.get<number>('MINIO_PORT') || 9000,
            useSSL:(config.get<string>('MINIO_USE_SSL')==='true')|| false,
            accessKey: config.get<string>('MINIO_ACCESS_KEY') || '',
            secretKey: config.get<string>('MINIO_SECRET_KEY') || '',
        }
      },
      inject:[ConfigService]
    })
    ]
})
export class MinioModule {

    static forRoot(options:MinioModuleOptions):DynamicModule {
        return {
            module: MinioModule,
            imports:[MinioCoreModule.forRoot(options)]
        }
    }

    static forRootAsync(options:MinioModuleAsyncOptions):DynamicModule {
        return {
            module: MinioModule,
            imports:[MinioCoreModule.forRootAsync(options)]
        }
    }

}
