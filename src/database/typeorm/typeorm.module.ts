import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeormModule} from '@nestjs/typeorm';
import { TypeormService } from './typeorm.service';
import { DataSource, DataSourceOptions } from 'typeorm';

const connections = new Map() //存储多租户的连接池

@Global()
@Module({
  imports: [
    NestTypeormModule.forRootAsync({
      useClass:TypeormService,
      dataSourceFactory:async (options:DataSourceOptions)=>{
        const tenant_id = options['tenant_id']
        if(tenant_id&&connections.has(tenant_id)) return connections.get(tenant_id)
        const dataSource = await new DataSource(options).initialize()
        connections.set(tenant_id,dataSource)
        return dataSource
      }
    })
  ],
  providers:[{
    provide:'TYPEORM_CONNECTIONS',// 给多租户的连接池,后续可以通过注入得到连接池并对连接池进行管理(销毁)
    useValue:connections
  }],
  exports:['TYPEORM_CONNECTIONS']
})

export class TypeOrmModule {}
