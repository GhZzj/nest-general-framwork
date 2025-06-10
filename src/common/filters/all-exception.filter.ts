import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Logger } from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: Logger;
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    console.log(exception) //控制台输出错误日志
    this.logger.error(`Error: ${exception.message}`, 'AllExceptionFilter'); //全局记录错误日志
  }
}
