import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from '../guards/rate-limit.guard';

export const RATE_LIMIT_KEY = 'rate_limit';

export enum RateLimitType {
  USER = 'user',
  IP = 'ip',
}

export type RateLimitOptions = {
  duration: number; // 时间窗口（秒）
  limit: number; // 允许的请求次数
  type: RateLimitType; // 新增：限流维度
};

/**
 * 速率限制装饰器（支持user/ip维度）
 * @param options 限流配置（时间窗口、次数、维度）
 */
export function RateLimit(options: RateLimitOptions) {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, options),
    UseGuards(RateLimitGuard),
  );
}