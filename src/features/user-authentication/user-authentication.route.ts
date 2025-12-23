import { Router } from 'express';

import { asyncHandler } from '~/utils/async-handler.js';

import {
  handleUserLogin,
  handleUserLogout,
  handleUserRegisteration,
} from './user-authentication.controller.js';

const router = Router();

router.post('/login', asyncHandler(handleUserLogin));
router.post('/register', asyncHandler(handleUserRegisteration));
router.post('/logout', asyncHandler(handleUserLogout));

export { router as userAuthenticationRoutes };
