import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from "@nestjs/common";
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from "@/database/prisma/prisma-options.interface";
import { PrismaClient as MySQLPrismaClient } from "prisma-mysql";
import { PrismaClient as PostgresPrismaClient } from "prisma-postgresql";
import { getDBType, handleRetry } from "@/database/prisma/prsima.utils";
import {
  PRISMA_CONNECTION_NAME, PRISMA_CONNECTIONS,
  PRISMA_MODULE_OPTIONS,
} from '@/database/prisma/prisma.constant';
import { catchError, defer, lastValueFrom } from "rxjs";
import { PrismaClientOptions } from "@prisma/client/runtime/library";

@Global()
@Module({})
export class PrismaCoreModule implements OnApplicationShutdown {
  private static connections :Record<string, any>=new Map();
  onApplicationShutdown(signal?: string) {
    if(PrismaCoreModule.connections.size>0){
      for (const connection of PrismaCoreModule.connections.values()) {
        connection.$disconnect().catch((err) => {
          console.error("PrismaClient shutdown error", err);
        })
      }
    }
  }

  static forRoot(options:PrismaModuleOptions):DynamicModule
  static forRoot(url:string):DynamicModule
  static forRoot(url:string,connectionName:string):DynamicModule
  static forRoot(arg:any,...args): DynamicModule {
    let _options:PrismaModuleOptions
    if(args&&args.length){
      _options = {url:arg,connectionName:args[0]}
    } else if(typeof arg === 'string'){
      _options = {url:arg}
    }else{
      _options = arg
    }
    const {
      url,
      connectionName,
      options,
      retryDelay = 3000,
      retryAttempts = 10,
      connectionErrorFactory,
      connectionFactory,
    } = _options;
    //从options中获取数据库类型
    let _prismaClient;
    const dbType = getDBType(url!);
    if (dbType === "mysql") {
      _prismaClient = MySQLPrismaClient;
    } else if (dbType === "postgresql") {
      _prismaClient = PostgresPrismaClient;
    } else {
      throw new Error("不支持的数据库类型");
    }

    const newOptions = {
      datasourceUrl: url,
      ...options,
    } as PrismaClientOptions;
    //给Provider设置名字
    const providerName = connectionName || PRISMA_CONNECTION_NAME; //默认为PRISMA_CONNECTION_NAME

    const prismaConnectionErrorFactory =
      connectionErrorFactory || ((error) => error);
    //通过工厂方法实例化Client
    const prismaConnectionFactory =
      connectionFactory ||
      (async (clientOptions: PrismaClientOptions) =>
        await new _prismaClient(clientOptions));

    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: async () => {
        //加入错误重试
        const client = await prismaConnectionFactory(newOptions);
        return lastValueFrom(
          defer(async () => await client.$connect()).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((err) => {
              throw prismaConnectionErrorFactory(err);
            }),
          ),
        ).then(() => client);
      },
    };

    return {
      module: PrismaCoreModule,
      providers: [prismaClientProvider],
      exports: [prismaClientProvider],
    };
  }

  static forRootAsync(_options: PrismaModuleAsyncOptions): DynamicModule {
    const { connectionName, useFactory, useClass, useExisting, inject } =
      _options;

    const providerName = connectionName || PRISMA_CONNECTION_NAME; //默认为PRISMA_CONNECTION_NAME

    const asyncProviders = this.createAsyncProviders(_options);

    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: (prismaModuleOptions: PrismaModuleOptions) => {
        const {
          url,
          options,
          retryDelay = 3000,
          retryAttempts = 10,
          connectionErrorFactory,
          connectionFactory,
        } = prismaModuleOptions;
        let _prismaClient;
        const dbType = getDBType(url!);
        if (dbType === "mysql") {
          _prismaClient = MySQLPrismaClient;
        } else if (dbType === "postgres") {
          _prismaClient = PostgresPrismaClient;
        } else {
          throw new Error("不支持的数据库类型");
        }
        const newOptions = {
          datasourceUrl: url,
          ...options,
        } as PrismaClientOptions;
        const prismaConnectionErrorFactory =
          connectionErrorFactory || ((error) => error);
        //通过工厂方法实例化Client
        const prismaConnectionFactory =
          connectionFactory ||
          (async (clientOptions: PrismaClientOptions) =>
            await new _prismaClient(clientOptions));
        return lastValueFrom(
          defer(async () => {
            const url = newOptions.datasourceUrl;
            if(this.connections.has(url))return this.connections.get(url);
            const client = await prismaConnectionFactory(newOptions);
            this.connections.set(url,client);
            return client;
          }).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((err) => {
              throw prismaConnectionErrorFactory(err);
            }),
          ),
        );
      },
      inject: [PRISMA_MODULE_OPTIONS],
    };

    const connectionsProvider= {
      provide:PRISMA_CONNECTIONS,
      useValue:this.connections
    }

    return {
      module: PrismaCoreModule,
      providers: [...asyncProviders, prismaClientProvider,connectionsProvider],
      exports: [prismaClientProvider,connectionsProvider],
    };
  }

  private static createAsyncProviders(options: PrismaModuleAsyncOptions) {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<PrismaOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PrismaModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PRISMA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<PrismaOptionsFactory>,
    ];
    return {
      provide: PRISMA_MODULE_OPTIONS,
      inject,
      useFactory: async (optionsFactory: PrismaOptionsFactory) =>
        await optionsFactory.createPrismaModuleOptions(),
    };
  }
}