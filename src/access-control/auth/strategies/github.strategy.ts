import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
          clientID: configService.get('GITHUB_CLIENT_ID') as string,
          clientSecret: configService.get('GITHUB_CLIENT_SECRET') as string,
          callbackURL: configService.get('GITHUB_CLIENT_CALLBACK_URL') as string,
          scope: ['public_profile'],
        });
      }
    
      async validate(accessToken: string, refreshToken: string, profile: Profile) {
        //console.log('profile', profile);
        //console.log('accessToken', accessToken);
        //console.log('refreshToken', refreshToken);
        return profile;//这里把profile返回，会自动保存到req.user中
      }
}