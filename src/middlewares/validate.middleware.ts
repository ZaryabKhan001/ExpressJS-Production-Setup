/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

export const createValidate = (key: 'body' | 'query' | 'params') => {
  return async function validate<T>(
    schema: ZodType<T>,
    request: Request,
    response: Response,
  ): Promise<T> {
    try {
      const result = await schema.parseAsync(request[key]);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        const normalizedErrors = error.issues.map(error_ => {
          const missingReceived =
            error_.code === 'invalid_type' &&
            (error_ as any).received === undefined &&
            error_.message.includes('received undefined');

          return {
            ...error_,
            message:
              error_.code === 'invalid_type' && missingReceived
                ? 'Required'
                : error_.message,
            ...(error_.code === 'invalid_type' && missingReceived
              ? { received: 'undefined' }
              : {}),
          } as const;
        });

        response.status(400).json({
          message: 'Bad Request',
          errors: normalizedErrors,
        });
        throw new Error('Validation Error');
      }
      throw error;
    }
  };
};

export const validateBody = createValidate('body');
export const validateQuery = createValidate('query');
export const validateParams = createValidate('params');
