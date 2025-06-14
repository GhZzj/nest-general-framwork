import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(protected configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:configService.get('JWT_SECRET') as string,
        });
    }

    async validate(payload: any,request:Request) {
        //console.log(payload);
        //给request添加user属性
        request.user = payload;
        return payload;
    }
}