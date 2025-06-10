import { Promise } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import {PrismaClient as MySqlPrismaClient} from 'prisma-mysql'
import * as argon2 from 'argon2'
import { UserVo } from '../auth/vo/user.vo';

export abstract class UserRepositoryAbstract{
  abstract find(username:string):any
  abstract findOne(id:string):Promise<any>
  abstract create(userObj:any):Promise<any>
  abstract update(userObj:string):Promise<any>
  abstract delete(id:string):Promise<any>
}


@Injectable()
export class userRepository extends UserRepositoryAbstract{
  @Inject("PRISMA_CLIENT")
  private readonly prismaClient:MySqlPrismaClient

  async create(userObj: any): Promise<any> {
    //对密码进行加密处理
    const {password} = userObj;
    const newHashPassword = await argon2.hash(password);
    return this.prismaClient.user.create({
      data: {
        ...userObj,
        password: newHashPassword
      }
    });
  }

  delete(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  find(username:string):any{
    return this.prismaClient.user.findUnique({
      where:{
        username:username
      }
    })
  }

  findOne(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  update(userObj: string): Promise<any> {
    return Promise.resolve(undefined);
  }

}