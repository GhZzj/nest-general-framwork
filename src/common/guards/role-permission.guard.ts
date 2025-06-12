import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PERMISSION_KEY } from '../decorators/role-permission.decorator';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '@/modules/user/user.repository';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;
  @Inject(UserRepository)
  private userRepository: UserRepository;
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>  {
    
    const classPermission = this.reflector.get<string[]>(PERMISSION_KEY, context.getClass())||[];//["user"]
    const methodPermission = this.reflector.get<string[]>(PERMISSION_KEY, context.getHandler())||[];//["read"]
    if(classPermission.length===0||methodPermission.length===0)return true;//无需权限校验
    //把classPermission数组和methodPermission数组拼接成user:read格式
    const requirePermissions= classPermission.map(permission=>{
      return methodPermission.map(method=>{
        return `${permission}:${method}`
      })
    }).flat()//flat()将多维数组转换为一维数组 ["user:read"]
    //console.log('requirePermissions', requirePermissions);//["user:read"]

    //判断用户是否具有requirePermissions中的权限
    const user = context.switchToHttp().getRequest().user;
    const userInfo = await this.userRepository.findByUsername(user.username)
    const roles = userInfo.userRole.map(userRole=>{
      return {
          roleId:userRole.role.id,
          name:userRole.role.name,
          description:userRole.role.description,
          permissions: userRole.role.rolePermissions.map(rolePermission => rolePermission.permission)
      }
  })
  //console.log('roles', roles);

  ///从roles数组上的permissions数组中返回requirePermissions数组中有的权限
  const userPermissions = roles.map(role=>{
    return role.permissions
  }).flat().map(permission=>permission.name) // ["user:read"，"user:create"]
  //console.log('userPermissions', userPermissions);

  //校验权限
  const isPermission = requirePermissions.every(permission=>userPermissions.includes(permission))
  if(!isPermission)throw new ForbiddenException('您没有权限访问该资源')
  return true
  }
}
