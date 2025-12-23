// src/errors/prisma-error.ts
import { Prisma } from '../../../generated/prisma/client.js';
import { BadRequestError } from './http-errors.js';

export function mapPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  if (error.code === 'P2002') {
    return new BadRequestError('Unique constraint violation');
  }

  return error;
}
