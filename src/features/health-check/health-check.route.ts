import express from 'express';

import { asyncHandler } from '~/utils/async-handler.js';

import { healthCheckHandler } from './health-check.controller.js';

const router = express.Router();

router.get('/', asyncHandler(healthCheckHandler));

export { router as healthCheckRoutes };
