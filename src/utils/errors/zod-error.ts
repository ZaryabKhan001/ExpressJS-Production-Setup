// src/errors/zod-error.ts
import { ZodError } from 'zod';

import { BadRequestError } from './http-errors.js';

export function mapZodError(error: ZodError): BadRequestError {
  const message = error.issues
    .map(error => `${error.path.join('.')}: ${error.message}`)
    .join(', ');

  return new BadRequestError(message);
}
