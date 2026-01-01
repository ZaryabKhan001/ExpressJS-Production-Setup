import type { NextFunction, Request, Response } from 'express';

import { config } from '~/config/index.js';

import { createRateLimiter } from '../config/redis.js';

export function rateLimiter({
  max,
  windowSeconds,
  isAuthenticated = false,
}: {
  max: number;
  windowSeconds: number;
  isAuthenticated?: boolean;
}) {
  if (config.nodeEnv === 'test') {
    return (_request: Request, _response: Response, next: NextFunction) =>
      next();
  }
  const limiter = createRateLimiter(max, windowSeconds);

  return async (request: Request, response: Response, next: NextFunction) => {
    const key = isAuthenticated ? request.user?.id || request.ip : request.ip;

    const { success, limit, remaining, reset } = await limiter.limit(key);

    response.setHeader('RateLimit-Limit', limit);
    response.setHeader('RateLimit-Remaining', remaining);
    response.setHeader('RateLimit-Reset', reset);

    if (!success) {
      return response.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  };
}
