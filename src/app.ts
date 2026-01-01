import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { notFoundHandler } from './middlewares/404-handler.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { apiV1Router } from './routes.js';

export const buildApp = (): Express => {
  const app = express();

  app.use(helmet());
  // Middleware for JSON parsing.
  app.use(express.json());
  app.use(cookieParser());

  // Group routes under /api/v1
  app.use('/api/v1', apiV1Router);

  // Handle 404
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};
