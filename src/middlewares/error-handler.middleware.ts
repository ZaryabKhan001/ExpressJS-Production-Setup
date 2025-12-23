// src/middlewares/error-handler.ts
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '../utils/errors/app-error.js';
import { getErrorMessage } from '../utils/errors/get-error-message.js';
import { mapPrismaError } from '../utils/errors/prisma-error.js';
import { mapZodError } from '../utils/errors/zod-error.js';

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
): void {
  let normalizedError = error;

  // Zod
  if (error instanceof ZodError) {
    normalizedError = mapZodError(error);
  }

  // Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    normalizedError = mapPrismaError(error);
  }

  // Known app errors
  if (normalizedError instanceof AppError) {
    response.status(normalizedError.statusCode).json({
      message: normalizedError.message,
    });
    return;
  }

  // Unknown / programming errors
  response.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : getErrorMessage(error),
  });

  // LOGGING (do not expose to client)
  console.error('[UNHANDLED ERROR]', error);
}
