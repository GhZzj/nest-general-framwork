import { CreatePermissionDto } from '@/modules/permission/dto/create-permission.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

interface PermissionType{
  id:number
  name:string
  action:string
  description?:string
}

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
  @Type(()=>CreatePermissionDto)    
  permissions:PermissionType[]
}
