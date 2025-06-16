import { Prisma } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface PrismaModuleOptions{
  connectionName?:string
  url?:string
  options?:Prisma.PrismaClientOptions,
  retryAttempts?:number
  retryDelay?:number
  connectionFactory?:(connectionOptions:PrismaClientOptions)=>any;
  connectionErrorFactory?:(error:Prisma.PrismaClientKnownRequestError)=>Prisma.PrismaClientKnownRequestError
}

export interface PrismaOptionsFactory{
  createPrismaModuleOptions():PrismaModuleOptions|Promise<PrismaModuleOptions>
}

export interface PrismaModuleAsyncOptions extends Pick<ModuleMetadata,"imports">{
  connectionName?:string
  useExisting?:Type<PrismaOptionsFactory>
  useClass?:Type<PrismaOptionsFactory>
  useFactory?:(...args:any[])=>Omit<PrismaModuleOptions,"connectionName">|Promise<Omit<PrismaModuleOptions,"connectionName">>
  inject?:any[]
}