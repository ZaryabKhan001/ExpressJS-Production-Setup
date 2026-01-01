import type { NextFunction, Request, Response } from 'express';

import { getJwtTokenFromCookie } from '~/features/user-authentication/user-authentication.helper.js';

export const requireAuthentication = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const decodedToken = getJwtTokenFromCookie(request);
    request.user = decodedToken;
    next();
  } catch {
    response.status(401).json({
      success: false,
      message: 'Unauthenticated!',
    });
  }
};
