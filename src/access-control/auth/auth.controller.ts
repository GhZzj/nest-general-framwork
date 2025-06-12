import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SigninUserDto } from '@/modules/auth/dto/signin-user.dto';
import { UserVo } from './vo/user.vo';
import { Serialize } from '@/common/decorators/serialize.decorator';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

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
