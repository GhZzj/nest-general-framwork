import { Promise } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import {PrismaClient as MySqlPrismaClient} from 'prisma-mysql'

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

  create(userObj: any): Promise<any> {
    return this.prismaClient.user.create({
      data:userObj
    })
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