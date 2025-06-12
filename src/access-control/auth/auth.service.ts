import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@/modules/user/user.repository';
import { SigninUserDto } from '@/modules/auth/dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2"

@Injectable()
export class AuthService {
  @Inject(UserRepository)
  private readonly userRepository:UserRepository
  @Inject(JwtService)
  private readonly jwtService:JwtService

  async signin(dto:SigninUserDto){
    const user = await this.userRepository.findByUsername(dto.username)
    if(!user)throw new UnauthorizedException('用户名不存在')
    //对argon2加密后的密码进行校验
    const isPasswordValid = await argon2.verify(user.password, dto.password)
    if(!isPasswordValid) throw new UnauthorizedException('用户密码错误')
    const payload = { userId: user.id, username: user.username }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
  
  async signup(dto:SigninUserDto){
    const existUser = await this.userRepository.findByUsername(dto.username);
    if (existUser) {
      throw new ConflictException('用户名已存在');
    }
    return this.userRepository.create(dto)
  }
}
