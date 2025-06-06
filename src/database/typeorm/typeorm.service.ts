import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TypeormService {
  @Inject(REQUEST)
  private readonly request: Request;
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  getDbConfig() {
    const dbConfig = this.configService.get("typeormDatabases");
    console.log(dbConfig);
    const tenantId = this.request.headers["x-tenant-id"]; //获取请求头中的tenantId
    //根据tenantId选择不同的数据库config
    console.log(tenantId);
    const config = dbConfig.find((item) => item.tenant_id == tenantId)
    console.log(config);
    if (!config) {
        throw new HttpException("Invalid Tenant Id", 400);
    }
    return config
  }


  refreshDbConfig(){

  }
}
