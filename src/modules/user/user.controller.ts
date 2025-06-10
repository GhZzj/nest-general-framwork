import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { Repository } from 'typeorm';
import { UserDocument } from '@/modules/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { AdminGuard } from '@/common/guards/admin.guard';
import { JwtGuard } from '@/common/guards/jwt.guard';

@Controller('user')
@UseGuards(JwtGuard,AdminGuard)
export class UserController {

  @InjectModel(User.name)//注入mongoose的model
  private readonly UserModel: Model<UserDocument>;
  @InjectRepository(User)//注入typeorm的repository
  private userRepository;
  @Inject('PRISMA_CLIENT')x
  private prisma: PrismaClient;

  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query("type") type: string) {
    let res
    if(type == 'typeorm'){
      res = await this.userRepository.find();
    }
    if(type == 'mongo'){
      res = await this.UserModel.find();
    }
    if(type == 'prisma'){
      res = await this.prisma.user.findMany();
    }
    return res
  }

  @Get(':id')
  findOne(@Param('id') id: string,@Req() request:any) {
    return "hello"
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
