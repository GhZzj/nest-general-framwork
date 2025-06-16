import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { RoleVo } from './vo/role.vo';
import { Create, Permission, Read, Update, Delete as PermissionDelete } from '@/common/decorators/role-permission.decorator';

@Controller('role')
@Permission('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Create()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Read()
  findAll(@Query('page',ParseIntPipe) page:number,@Query("pageSize",ParseIntPipe) pageSize:number) {
    return this.roleService.findAll(page,pageSize);
  }

  @Get(':id')
  @Read()
  @Serialize(RoleVo)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @Update()
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
