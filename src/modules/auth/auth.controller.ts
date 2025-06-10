import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SigninUserDto } from '@/modules/auth/dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post("signin")
  async signin(@Body() dto:SigninUserDto) {
    return this.authService.signin(dto)
  }

  @Post("signup")
  async signup(@Body() dto:SigninUserDto) {
    return this.authService.signup(dto)
  }
}
