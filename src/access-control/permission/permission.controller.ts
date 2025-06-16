import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Create, Permission } from '@/common/decorators/role-permission.decorator';
import { Read } from '@/common/decorators/role-permission.decorator';
import { Update } from '@/common/decorators/role-permission.decorator';
import { Delete as PermissionDelete } from '@/common/decorators/role-permission.decorator';
@Controller('permission')
@Permission('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Create()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Read()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Read()
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @Update()
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
