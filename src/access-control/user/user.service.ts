import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
  @Inject(UserRepository)
  private userRepository:UserRepository
  @Inject('PRISMA_CLIENT')
  private prisma: PrismaClient;
  constructor() {
    console.log('User service created');
  }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findByUsername(createUserDto.username)
    if(existUser)throw new BadRequestException('用户名已存在')
    return await this.userRepository.create(createUserDto)
  }

  findAll(page,pageSize) {
    return this.userRepository.findAll(page,pageSize)
  }

  findOne(username: string) {
    return this.userRepository.findByUsername(username)
  }

  update( updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }
}
