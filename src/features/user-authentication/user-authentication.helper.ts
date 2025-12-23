import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '~/config/index.js';

import type { UserProfile } from '../../../generated/prisma/client.js';
import { JWT_COOKIE_NAME } from './constants.js';

dotenv.config();

//? Types
type TokenPayload = {
  id: string;
  email: string;
};

/**
 * Hash a Password
 *
 * @param password - Password that has to be hashed
 * @returns hashedPassword - The hashed password
 */
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare Passwords
 *
 * @param password - Password to compare
 * @param hashedPassword - Actual Password to compare against
 * @returns True if password is valid, false otherwise
 */
export const getIsPasswordValid = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT Token
 *
 * @param userProfile - The user profile to generate the token for
 * @returns The generated JWT Token
 */
export const generateJwtToken = (userProfile: UserProfile) => {
  const tokenPayload: TokenPayload = {
    id: userProfile.id,
    email: userProfile.email,
  };
  return jwt.sign(tokenPayload, config.jwtSecret as string, {
    expiresIn: '15m', // 15 mints
  });
};

/**
 * Set JWT Cookie
 *
 * @param response - The response object to set the cookie on
 * @param token - Token
 */
export const setJwtCookie = (response: Response, token: string) => {
  response.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
  });
};

/**
 * Clear JWT Cookie
 *
 * @param response - The response object to clear the cookie on
 */
export const clearJwtCookie = (response: Response) => {
  response.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
  });
};

/**
 * Check if token is valid
 *
 * @param token - The token to be checked
 * @returns true if token is valid, false otherwise
 */
export const isTokenValid = (
  token: jwt.JwtPayload | string,
): token is TokenPayload => {
  if (
    typeof token === 'object' &&
    token !== null &&
    'id' in token &&
    'email' in token
  ) {
    return true;
  }
  return false;
};

/**
 * Get JWT token from the cookie.
 *
 * @param request - The request object to get the cookie from.
 * @returns The JWT token from the cookie
 */
export const getJwtTokenFromCookie = (request: Request) => {
  const token = request.cookies[JWT_COOKIE_NAME];

  if (!token) {
    throw new Error('No Token Found');
  }

  const decodedToken = jwt.verify(token, config.jwtSecret as string);

  if (isTokenValid(decodedToken)) {
    return decodedToken;
  }
  throw new Error('Invalid token payload');
};
