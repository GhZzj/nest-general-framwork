import { DynamicModule, Module, } from '@nestjs/common';
import { SshCoreModule } from './ssh-core.module';
import { SshModuleAsyncOptions, SshModuleOptions } from './ssh.inerface';

@Module({})
export class SshModule {
    /**
     * 
     * @param options 配置
     * @param name 注入实例SshService的名称 默认为sshService类
     * @returns 
     */
    static forRoot(options: SshModuleOptions,name?: string): DynamicModule {
        return {
            module:SshModule,
            imports:[SshCoreModule.forRoot(options,name)],
        }
    }

    static forRootAsync(options: SshModuleAsyncOptions,name?: string): DynamicModule {
       return{ 
            module:SshModule,
            imports:[SshCoreModule.forRootAsync(options,name)],
       }
    }

    
}
