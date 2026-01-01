import type { NextFunction, Request, Response } from 'express';

import { NotFoundError } from '../utils/errors/http-errors.js';

export function notFoundHandler(
  request: Request,
  _: Response,
  next: NextFunction,
): void {
  next(new NotFoundError(`Route ${request.originalUrl} not found`));
}
