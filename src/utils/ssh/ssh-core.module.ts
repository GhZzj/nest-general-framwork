import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { SshModuleAsyncOptions, SshModuleOptions, SshOptionsFactory } from "./ssh.inerface";
import { SshService } from "./ssh.service";

export const SSH_MODULE_OPTIONS = Symbol('SSH_MODULE_OPTIONS');

@Global()
@Module({})
export class SshCoreModule {

    static forRoot(options:SshModuleOptions,name?:string):DynamicModule {
        // 如果没有指定name，则使用SshService作为providerName
        const providerName = name ? name : SshService; 
        // 创建一个Provider 对象，用于提供SshService实例
        const clientProvider:Provider = {
            provide: providerName,
            useFactory: async () => {
                const ssh = new SshService(options);
                return ssh;
            },
        }
        // 返回一个DynamicModule对象，包含module、providers、exports
        return {
            module: SshCoreModule,
            providers:[clientProvider],
            exports:[clientProvider]
        }
    }

    static forRootAsync(options:SshModuleAsyncOptions,name?:string):DynamicModule {
        const asyncOptionProviders = this.createAsyncOptionsProvider(options);
        const providerName = name ? name : SshService;
        const clientProvider:Provider = {
            provide: providerName,
            useFactory: async (options:SshModuleOptions) => {
                const ssh = new SshService(options);
                return ssh;
            },
            inject:[SSH_MODULE_OPTIONS]
        }
        return {
            module: SshCoreModule,
            imports:[],
            providers:[...asyncOptionProviders,clientProvider],
            exports:[clientProvider]
        }
    }

     static createAsyncOptionsProvider(options:SshModuleAsyncOptions):Provider[]{
        let providers:Provider[]=[];
         if(options.useFactory){
            providers.push({
                 provide:SSH_MODULE_OPTIONS,
                 useFactory:options.useFactory,
                 inject:options.inject || []
             })
             return providers;
         }
         if(options.useClass){
             providers.push({
                provide:options.useClass,
                useClass:options.useClass
             })
         }
         const inject = options.useClass||options.useExisting as Type<SshOptionsFactory>
         providers.push({
             provide:SSH_MODULE_OPTIONS,
             useFactory:async (optionsFactory: SshOptionsFactory) =>await optionsFactory.createSshOptions(),
             inject:[inject]
         })
         return providers;
     }
}
