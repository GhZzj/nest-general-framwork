import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errCode = exception.getStatus();
    const errMsg = exception.message;
    //winston 记录错误日志

    response.status(200).json({
      code: errCode,
      msg: errMsg,
      data: null,
    });
  }
}
