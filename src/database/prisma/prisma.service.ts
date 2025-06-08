import { PrismaModuleOptions, PrismaOptionsFactory } from '@/database/prisma/prisma-options.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
export class PrismaService implements PrismaOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(REQUEST)
  private readonly request: Request;
  createPrismaModuleOptions():
    | PrismaModuleOptions
    | Promise<PrismaModuleOptions> {
    let dbConfig = this.configService.get('prismaDatabases');
    let tenantId = this.request.headers['x-tenant-id']
    dbConfig = dbConfig.find(item => item.tenant_id == tenantId)
    if(!dbConfig)throw new HttpException(`未找到租户${tenantId}的数据库配置`,404)
    return dbConfig
  }
}