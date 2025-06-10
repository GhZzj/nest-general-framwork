import { userRepository } from '@/modules/user/user.repository';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  @Inject(userRepository)
  private readonly userRepository:userRepository
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const {username} = user;
    const userInfo = await this.userRepository.find(username);
    if(!userInfo)throw new UnauthorizedException('用户不存在');
    console.log(userInfo);
    //if(userInfo.role !== 'admin')throw new UnauthorizedException('无权限');
    return true;
  }
}
