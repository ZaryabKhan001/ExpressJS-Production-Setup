import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';

import { apiV1Router } from './routes.js';

export const buildApp = (): Express => {
  const app = express();

  // Middleware for JSON parsing.
  app.use(express.json());
  app.use(cookieParser());
  // Group routes under /api/v1
  app.use('/api/v1', apiV1Router);

  return app;
};
