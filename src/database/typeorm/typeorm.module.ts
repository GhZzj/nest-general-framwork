import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeormModule} from '@nestjs/typeorm';
import { TypeormService } from './typeorm.service';

@Module({
  imports: [
    NestTypeormModule.forRootAsync({
      extraProviders:[TypeormService],
      inject: [TypeormService],
      useFactory: (typeormService:TypeormService) => {
        const config = typeormService.getDbConfig(); // 获取数据库配置
        return{
         ...config,
          autoLoadEntities: true, //自动加载实体
          synchronize: false, //自动同步数据库结构
        }
      }
    })
  ],
  providers: [TypeormService]
})

export class TypeOrmModule {}
