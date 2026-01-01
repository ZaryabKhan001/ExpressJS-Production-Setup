import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import { requireAuthentication } from '~/middlewares/require-authentication.middleware.js';

const app = express();
app.use(cookieParser());

app.get(
  '/protected/profile',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      // Inline usage of require authentication to get token
      await requireAuthentication(request, response, next);
      response.status(200).json({
        success: true,
        message: `Hello,`,
      });
    } catch (error) {
      next(error);
    }
  },
);
