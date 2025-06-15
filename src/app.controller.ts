import { Controller, Get, Inject } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { SshService } from "./utils/ssh/ssh.service";
import { MINIO_CLIENT } from "./integrations/oss/minio/minio.constant";
import * as Minio from "minio";

@Controller()
export class AppController {
 // @Inject("SSH_SERVICE")
  //private readonly sshService: SshService;
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
   // return this.sshService.exec('ls -la /tmp')
  }

  @Inject(MINIO_CLIENT)
  private readonly minioClient: Minio.Client;
  @Get('minioTestUpload')
  async minioTest() {
    let res= await this.minioClient.fPutObject('nest', 'hello.ts', 'src/main.ts');
    console.log(res);
    return 'http://localhost:9000/nest/hello.ts';
  }
  
}
 
