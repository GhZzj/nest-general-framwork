import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { MinioModuleAsyncOptions, MinioModuleOptions, MinioOptionsFactory } from "./minio.interface";
import * as Minio from 'minio';
import { MINIO_CLIENT, MINIO_CLIENTS, MINIO_OPTIONS } from "./minio.constant";

const minioClients = new Map<string, Minio.Client>();

@Global()
@Module({})
export class MinioCoreModule {

    static forRoot(options:MinioModuleOptions) :DynamicModule{
        const {clientName,...minOptions} = options;
        const providerName = options.clientName||MINIO_CLIENT;
        const clientProvider ={
            provide: providerName,
            useFactory: () => {
                const client = new Minio.Client(minOptions);
                return client;
            }
        }
        return {
            module: MinioCoreModule,
            providers: [clientProvider],
            exports: [clientProvider]
        }
    }

    static forRootAsync(options:MinioModuleAsyncOptions) :DynamicModule{
        const {clientName,...minOptions} = options;
        const providerName = options.clientName||MINIO_CLIENT;
        const optionsProvider = this.createAsyncOptionsProvider(minOptions);
        
        const clientProvider ={
            provide: providerName,
            useFactory: (options:MinioModuleOptions) => {
                const clientKey= options.endPoint + options.port + options.region
                if(minioClients.has(clientKey))return minioClients.get(clientKey);
                const client = new Minio.Client(options);
                minioClients.set(clientKey,client);
                return client;
            },
            inject: [MINIO_OPTIONS]
        }

        const minioClientsProvider = {
            provide: MINIO_CLIENTS,
            useFactory: () => minioClients,
            inject: []
        }
        return {
            module: MinioCoreModule,
            providers: [...optionsProvider,clientProvider,minioClientsProvider],
            exports: [clientProvider,minioClientsProvider]
        }
    }

    static createAsyncOptionsProvider(options:MinioModuleAsyncOptions) :Provider[]{
        let providers:Provider[] = [];
        if(options.useFactory){
            providers.push({
                provide:MINIO_OPTIONS,
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
        const inject = options.useExisting||options.useClass as Type<MinioOptionsFactory>
        providers.push({
            provide:MINIO_OPTIONS,
            useFactory:(optionsFactory:MinioOptionsFactory)=>optionsFactory.createMinioOptions(),
            inject:[inject]
        })
        return providers;
    }
}