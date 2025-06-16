import { SetMetadata } from "@nestjs/common";
import { Action } from "../enum/actions.enum";

export const PERMISSION_KEY="PERMISSION_KEY"

/**
 * 累积元数据的装饰器工厂函数
 * @param key - 元数据的键名
 * @param permission - 要添加的权限值
 * @returns 返回一个方法装饰器或类装饰器
 * 
 * 这个装饰器用于在方法或类上累积权限元数据。它会:
 * 1. 获取已存在的权限数组
 * 2. 将新的权限添加到数组中
 * 3. 使用SetMetadata将更新后的权限数组设置回目标上
 */
export const accumlateMetadata = (key: string, permission: string) => {
    return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        const permissions = Reflect.getMetadata(PERMISSION_KEY, descriptor?.value || target) || [];
        Reflect.defineMetadata(PERMISSION_KEY, [...permissions, permission.toLowerCase()], descriptor?.value || target);
    };
};

/**
 * 权限装饰器工厂函数
 * @param permission - 权限名称
 * @returns 返回一个方法装饰器或类装饰器
 * 
 * 这个装饰器用于在方法或类上定义权限。它会:
 * 1. 获取已存在的权限数组
 * 2. 将新的权限添加到数组中
 * 3. 使用SetMetadata将更新后的权限数组设置回目标上
 */
export const Permission = (permission: string) => accumlateMetadata(PERMISSION_KEY, permission)

export const Create = () => accumlateMetadata(PERMISSION_KEY, Action.Create)

export const Update = () => accumlateMetadata(PERMISSION_KEY, Action.Update)

export const Read = () => accumlateMetadata(PERMISSION_KEY, Action.Read)

export const Delete = () => accumlateMetadata(PERMISSION_KEY, Action.Delete)

export const Manage = () => accumlateMetadata(PERMISSION_KEY, Action.Manage)
