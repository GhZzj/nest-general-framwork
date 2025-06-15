import { Controller, Get, Inject } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { SshService } from "./utils/ssh/ssh.service";


@Controller()
export class AppController {
 // @Inject("SSH_SERVICE")
  //private readonly sshService: SshService;
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
   // return this.sshService.exec('ls -la /tmp')
  }
}
