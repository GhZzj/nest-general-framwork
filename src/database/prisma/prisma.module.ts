import { DynamicModule, Global, Module } from '@nestjs/common';
import { PrismaCoreModule } from '@/database/prisma/prisma-core.module';
import { PrismaModuleAsyncOptions, PrismaModuleOptions } from '@/database/prisma/prisma-options.interface';
import { PrismaService } from '@/database/prisma/prisma.service';

@Global()
@Module({
  imports:[PrismaCoreModule.forRootAsync({
    connectionName:"PRISMA_CLIENT",
    useClass: PrismaService
    /*useFactory:(configService:ConfigService)=>{
      const dbConfig = configService.get("prismaDatabases")
      return dbConfig[0]
    },
    inject: [ConfigService]*/
  })]
})
export class PrismaModule {}
