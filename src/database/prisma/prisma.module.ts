import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({})
export class PrismaModule {

  static forRoot(){
    return {
      module:PrismaModule,
      imports:[],
      providers:[],
      exports:[]
    }
  }

  static forRootAsync(){
    return {
      module:PrismaModule,
      imports:[],
      providers:[],
      exports:[]
    }
  }
}
