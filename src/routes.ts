import express from 'express';

import { healthCheckRoutes } from './features/health-check/health-check.route.js';
import { userAuthenticationRoutes } from './features/user-authentication/user-authentication.route.js';
import { requireAuthentication } from './middlewares/require-authentication.middleware.js';

export const apiV1Router = express.Router();

apiV1Router.use('/health-check', healthCheckRoutes);
apiV1Router.use(userAuthenticationRoutes);
apiV1Router.use('/user-profile', requireAuthentication);
