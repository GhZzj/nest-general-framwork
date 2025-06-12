import { Exclude, Expose, Transform } from "class-transformer";
import { CreateUserVo } from "./createUser.vo";

export class UserVo  extends CreateUserVo{

    @Expose({name:'userRole'})
    @Transform(({value})=>{
        const roles = value.map(userRole=>{
            return {
                roleId:userRole.role.id,
                name:userRole.role.name,
                description:userRole.role.description,
                permissions: userRole.role.rolePermissions.map(rolePermission => rolePermission.permission)
            }
        })
        return roles
    })
    roles:any

}
