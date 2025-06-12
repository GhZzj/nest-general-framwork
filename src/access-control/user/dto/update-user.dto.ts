import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateRoleDto } from '@/modules/role/dto/create-role.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsInt()
    @IsNotEmpty()
    id:number
}
