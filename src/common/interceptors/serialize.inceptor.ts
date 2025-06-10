import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class SerializerInterceptor implements NestInterceptor{
    constructor(private dto: any,private flag?:boolean) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map((data) => {
            return plainToInstance(this.dto, data, {
                excludeExtraneousValues: this.flag, // 排除不在dto中的属性(强制必须使用Expose控制字段存在)
                enableImplicitConversion: true, // 自动转换类型
            });
        }));
    }
}

