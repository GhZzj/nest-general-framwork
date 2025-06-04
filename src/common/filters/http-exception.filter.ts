import { Catch, ExceptionFilter, HttpException, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  logger: Logger;
  catch(exception: any, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errCode = exception.getStatus();
    //winston 记录错误日志
    let errorMessage =  exception.getResponse().message || exception.getResponse() //获取异常信息
    if(typeof errorMessage =='object') errorMessage= errorMessage.join(',') //对异常信息进行处理 array->string
    this.logger.error("HttpException " + errorMessage,HttpExceptionFilter.name); //logger记录异常信息
    response.status(200).json({
      code: errCode,
      msg: errorMessage,
      data: null,
    });
  }
}
