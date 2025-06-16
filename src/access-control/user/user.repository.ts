import { Promise } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import {PrismaClient as MySqlPrismaClient} from 'prisma-mysql'
import * as argon2 from 'argon2'


@Injectable()
export class UserRepository  {
  @Inject("PRISMA_CLIENT")
  private readonly prismaClient:MySqlPrismaClient

  async create(userObj: any): Promise<any> {
    return await this.prismaClient.$transaction(async (prisma:MySqlPrismaClient)=>{
      const roleIds = userObj.roleIds||[]
      //验证roleIds是否存在
      const roles = await prisma.role.findMany({})
      const validRoleIds = roles.filter(role=>roleIds.includes(role.id))
      //创建用户角色关联
      //对密码进行加密处理
      const {password} = userObj;
      const newHashPassword = await argon2.hash(password);
      delete userObj.roleIds //删除roleIds字段 Prisma不支持传入表结构中不存在的字段
      return prisma.user.create({
        data:{
          ...userObj,
          password:newHashPassword,
          userRole:{
            create:validRoleIds.map(role=>({
              roleId:role.id
            }))
          }
        }
      })
    })
  }

  delete(id: number) {
    return this.prismaClient.$transaction(async (prisma:MySqlPrismaClient)=>{
      await prisma.userRole.deleteMany({
        where:{
          userId:id
        }
      })
      return prisma.user.delete({
        where:{
          id
        }
      })
    })
  }

  findAll(page=1,pageSize=10){
    let skip = (page-1) * pageSize
    return this.prismaClient.user.findMany({
      skip,
      take:pageSize
    })
  }

  findByUsername(username:string):any{
    return this.prismaClient.user.findUnique({
      where:{
        username:username
      },
      include:{
        userRole:{
          select:{
            role:{
              select:{
                id:true,
                name:true,
                description:true,
                rolePermissions:{
                  select:{
                    permission:true
                  }
                }
              }
            }
          }
        }
      }
    })
  }



  update(userObj: any): Promise<any> {
    const roleIds = userObj.roleIds||[]
    return this.prismaClient.$transaction(async (prisma:MySqlPrismaClient) => {
      //删除userRole关联数据 然后重新关联
      await prisma.userRole.deleteMany({
        where:{
          userId:userObj.id
        }
      })
      //重新创建关联
      return prisma.user.update({
        where:{
          id:userObj.id
        },
        data:{
          userRole:{
            create:roleIds.map(roleId=>({
              roleId
            }))
          }
        }
      })
    })
  }
}