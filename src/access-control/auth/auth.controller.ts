import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';

import { UserVo } from './vo/user.vo';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Get("signup/google")
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get("signup/google/callback")
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    return {
      user: req.user
    }
  }

  @Get("signup/github")
  @UseGuards(AuthGuard('github'))//前端请求这个接口后会自动跳转到github登录页面 授权后会跳转回callback接口校验返回token
  async githubLogin() {}
  
  @Get("signup/github/callback")
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req) {
    //console.log(req.user) 校验成功后，会自动把用户信息放到req.user中
    const dto = {userId:1, username:'test'}
    return {
      access_token: await this.authService.generateToken(dto) 
    }
  }

  @Post("signin")
  async signin(@Body() dto:SigninUserDto) {
    return this.authService.signin(dto) 
  }
  
  @Post("signup")
  @Serialize(UserVo)
  async signup(@Body() dto:SigninUserDto) {
    const user = await this.authService.signup(dto)
    return user
  }
}
