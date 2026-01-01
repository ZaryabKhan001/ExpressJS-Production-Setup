import type { JwtPayload } from '~/features/user-authentication/user-authentication.helper.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
