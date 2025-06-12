import { Expose, Transform } from "class-transformer";
import { CreateRoleDto } from "../dto/create-role.dto";

export class RoleVo extends CreateRoleDto{
   @Transform(({value})=>{
       return value.map(rolePermission=>{
            return rolePermission.permission
        })
   })
   @Expose({name:'rolePermissions'}) //原始字段的名字从rolePermission-->permissions
   permissions:any[]
}