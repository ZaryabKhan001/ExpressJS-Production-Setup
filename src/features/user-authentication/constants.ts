import { type RateLimitConfig } from '../../types/types.js';

export const JWT_COOKIE_NAME: string = 'jwt';

export const rateLimits: Record<string, RateLimitConfig> = {
  '/login': { max: 10, windowSeconds: 600, isAuthenticated: false },
  '/register': { max: 5, windowSeconds: 600, isAuthenticated: false },
  '/logout': { max: 30, windowSeconds: 60, isAuthenticated: true },
};
