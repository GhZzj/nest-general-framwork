import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6,18)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6,18)
  password: string;

  @IsOptional()
  @IsArray() 
  @IsNumber({}, {each:true})
  roleIds:number[]
}
