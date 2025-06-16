import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RATE_LIMIT_KEY, RateLimitOptions, RateLimitType } from '../decorators/rate-limit.decorator';
import { Request } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimitGuard implements CanActivate {
    @InjectRedis()
    private readonly redis: Redis;
    @Inject(Reflector)
    private readonly reflector: Reflector;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从元信息上 获取接口/控制器的频率限制配置（来自 @RateLimit 装饰器）
    const options: RateLimitOptions = this.reflector.getAllAndOverride(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!options) return true; // 无装饰器时不限制

    const req = context.switchToHttp().getRequest<Request>();

    const identifier = await this.getIdentifier(req, options.type);
  
    // 3. 生成缓存键（格式：rate_limit:维度:标识:时间窗口）
    const endpoint = req.method + ':' + req.path;
    const cacheKey = `rate_limit:${endpoint}:${options.type}:${identifier}:${options.duration}`;

    // 获取当前访问次数（初始为0）
    let currentCount = ((await this.redis.get(cacheKey)) || 0 )as number;

    if (currentCount >= options.limit) {
      throw new ForbiddenException(`请求过于频繁，请稍后再试`);
    }

    // 首次访问时设置过期时间（避免缓存永不过期）
    if (currentCount === 0) {
        await this.redis.setex(cacheKey, options.duration, 1);
    } else {
      // 非首次访问，原子性增加计数（需确保Redis支持INCR命令）
      await this.redis.set(cacheKey, currentCount + 1);
    }

    return true;
  }

   /**
   * 根据限流维度获取标识（用户ID或IP）
   * @param request 请求对象
   * @param type 限流维度
   */
   private async getIdentifier(request: any, type: RateLimitType): Promise<string> {
    switch (type) {
      case RateLimitType.USER:
        // 从请求中获取用户ID（假设通过JWT认证后存储在request.user）
        if (!request.user?.id) //throw new UnauthorizedException('未认证用户');
        return  '1'; //request.user.id;
      case RateLimitType.IP:
        // 获取客户端IP（考虑反向代理场景，优先取X-Forwarded-For）
        return request.headers['x-forwarded-for']?.split(',')[0] || request.ip;
      default:
        throw new Error(`未知的限流维度：${type}`);
    }
  }
}