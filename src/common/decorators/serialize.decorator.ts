import { UseInterceptors } from "@nestjs/common"
import { SerializerInterceptor } from "../interceptors/serialize.inceptor"

//创建一个serialize装饰器
export const Serialize=(dto:any,flag?:boolean)=>{
    return UseInterceptors(new SerializerInterceptor(dto,flag))
}