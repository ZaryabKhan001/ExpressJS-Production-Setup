import { Router } from 'express';

import { asyncHandler } from '~/utils/async-handler.js';

import { rateLimiter } from '../../middlewares/rate-limiter.middleware.js';
import { requireAuthentication } from '../../middlewares/require-authentication.middleware.js';
import { type RateLimitConfig } from '../../types/types.js';
import { rateLimits } from './constants.js';
import * as controller from './user-authentication.controller.js';

const router = Router();

router.post(
  '/login',
  rateLimiter(rateLimits['/login'] as RateLimitConfig),
  asyncHandler(controller.handleUserLogin),
);

router.post(
  '/register',
  rateLimiter(rateLimits['/register'] as RateLimitConfig),
  asyncHandler(controller.handleUserRegisteration),
);

router.post(
  '/logout',
  requireAuthentication,
  rateLimiter(rateLimits['/logout'] as RateLimitConfig),
  asyncHandler(controller.handleUserLogout),
);

export { router as userAuthenticationRoutes };
