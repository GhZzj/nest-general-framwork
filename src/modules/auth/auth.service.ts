import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { userRepository } from '@/modules/user/user.repository';
import { SigninUserDto } from '@/modules/auth/dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject(userRepository)
  private readonly userRepository:userRepository
  @Inject(JwtService)
  private readonly jwtService:JwtService
  async signin(dto:SigninUserDto){
    const user = await this.userRepository.find(dto.username)
    if(!user)throw new UnauthorizedException('用户名不存在')
    if(user.password !== dto.password)throw new UnauthorizedException('用户密码错误')
    const payload = { userId: user.id, username: user.username }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
  async signup(dto:SigninUserDto){
    const existUser = await this.userRepository.find(dto.username);
    if (existUser) {
      throw new ConflictException('用户名已存在');
    }
    return this.userRepository.create(dto)
  }
}
