import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto{
  @IsNotEmpty()
  @IsString()
  @Length(3, 12,{ message: 'Username must be between 3 and 12 characters' })
  username:string

  @IsNotEmpty()
  @IsString()
  @Length(6, 18,{ message: 'Password must be between 6 and 18 characters' })
  password:string
}