import { Global, DynamicModule, Module, Provider, Type } from "@nestjs/common"
import { AliyunOssModuleAsyncOptions, AliyunOssModuleOptions, AliyunOssOptionsFactory } from "./aliyun-oss.interface"
import { ALIYUN_OSS_CLIENT, ALIYUN_OSS_CLIENTS, ALIYUN_OSS_OPTIONS } from "./aliyun-oss.constant"
import OSS from "ali-oss"

const aliyunOssClients = new Map<string, OSS>()

@Global()
@Module({})
export class AliyunOssCoreModule {
    
    static forRoot(options: AliyunOssModuleOptions): DynamicModule {
        const {clientName,...alyunOssOptions} = options
        const providerName = clientName || ALIYUN_OSS_CLIENT
        const clientProvider:Provider = {
            provide: providerName,
            useFactory: () => {
                const client = new OSS(alyunOssOptions)
                return client
            }
        }
        return {
            module: AliyunOssCoreModule,
            providers: [clientProvider],
            exports: [clientProvider]
        }
    }

    static forRootAsync(options: AliyunOssModuleAsyncOptions): DynamicModule {
        const {clientName,...aliyunOssOptions} = options
        const optionsProvider:Provider[] = this.createAsyncOptionsProvider(aliyunOssOptions)
        const providerName = clientName || ALIYUN_OSS_CLIENT
        const clientProvider:Provider = {
            provide: providerName,
            useFactory: (options:AliyunOssModuleOptions) => {
                const clientKey = options.bucket! + options.region
                if(aliyunOssClients.has(clientKey)) return aliyunOssClients.get(clientKey)
                const client = new OSS(options)
                aliyunOssClients.set(providerName,client)
                return client
            },
            inject: [ALIYUN_OSS_OPTIONS]
        }

        const aliyunOssClientsProvider:Provider = {
            provide: ALIYUN_OSS_CLIENTS,
            useFactory: () => aliyunOssClients,
            inject: []
        }

        return {
            module: AliyunOssCoreModule,
            providers: [...optionsProvider,clientProvider,aliyunOssClientsProvider],
            exports: [clientProvider,aliyunOssClientsProvider]
        }
    }

    static createAsyncOptionsProvider(options:AliyunOssModuleAsyncOptions) :Provider[]{
        let providers:Provider[] = [];
        if(options.useFactory){
            providers.push({
                provide:ALIYUN_OSS_OPTIONS,
                useFactory:options.useFactory,
                inject:options.inject||[]
            });
            return providers;
        }
        if(options.useClass){
            providers.push({
                provide:options.useClass,
                useClass:options.useClass
            })
        }
        const inject = options.useExisting||options.useClass as Type<AliyunOssOptionsFactory>
        providers.push({
            provide:ALIYUN_OSS_OPTIONS,
            useFactory:(optionsFactory:AliyunOssOptionsFactory)=>optionsFactory.createAliyunOssOptions(),
            inject:[inject]
        })
        return providers;
    }
}