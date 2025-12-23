import type { Request, Response } from 'express';

import { getJwtTokenFromCookie } from '~/features/user-authentication/user-authentication.helper.js';

export const requireAuthentication = async (
  request: Request,
  response: Response,
) => {
  try {
    return getJwtTokenFromCookie(request);
  } catch {
    throw response.status(401).json({
      success: false,
      message: 'Unauthenticated!',
    });
  }
};
