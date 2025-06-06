import { HttpException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { TypeOrmDataSourceFactory, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  @Inject(REQUEST)
  private request: Request;
  @Inject(ConfigService)
  private configService: ConfigService;

  createTypeOrmOptions(connectionName?:string): TypeOrmModuleOptions {
    const dbConfig = this.configService.get("typeormDatabases");
    const tenantId = this.request.headers["x-tenant-id"]; //获取请求头中的tenantId
    //根据tenantId选择不同的数据库config
    const config = dbConfig.find((item) => item.tenant_id == tenantId)
    if (!config) {
      throw new HttpException("Invalid Tenant Id", 400);
    }
    config.autoLoadEntities=true //自动加载实体
    return config
  }


}
