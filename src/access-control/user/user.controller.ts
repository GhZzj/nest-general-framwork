import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { AdminGuard } from '@/common/guards/admin.guard';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolePermissionGuard } from '@/common/guards/role-permission.guard';
import { Create, Permission, Read, Update, Delete as PermissionDelete } from '@/common/decorators/role-permission.decorator';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { UserVo } from './vo/user.vo';
import { CreateUserVo } from './vo/createUser.vo';


@Controller('user')
@UseGuards(JwtGuard,AdminGuard,RolePermissionGuard)
@Permission('user')// 控制器级别权限为user
export class UserController {

  @Inject('PRISMA_CLIENT')
  private prisma: PrismaClient;

  constructor(private readonly userService: UserService) {}

  @Post()
  @Serialize(CreateUserVo)
  @Create()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Read()
  @Serialize(CreateUserVo)
  async findAll(@Query("page",ParseIntPipe) page: number,@Query("pageSize",ParseIntPipe) pageSize:number) {
    return this.userService.findAll(page,pageSize);
  }

  @Get(':username')
  @Read()// 方法级别权限为read
  @Serialize(UserVo)
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Patch()
  @Update()
  @Serialize(CreateUserVo)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update( updateUserDto);
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
