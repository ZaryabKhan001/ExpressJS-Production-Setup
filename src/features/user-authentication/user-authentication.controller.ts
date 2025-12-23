import type { Request, Response } from 'express';
import { z } from 'zod';

import { validateBody } from '~/middlewares/validate.middleware.js';

import {
  retrieveUserProfileFromDatabaseByEmail,
  saveUserProfileToDatabase,
} from '../user-profile/user-profile.model.js';
import {
  clearJwtCookie,
  generateJwtToken,
  getIsPasswordValid,
  hashPassword,
  setJwtCookie,
} from './user-authentication.helper.js';

export const handleUserRegisteration = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const body = await validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
    request,
    response,
  );

  const existingUser = await retrieveUserProfileFromDatabaseByEmail(body.email);

  if (existingUser) {
    response.status(409).json({
      success: false,
      message: 'User already exists.',
    });
    return;
  }

  const hashedPassword = await hashPassword(body.password);

  const savedUser = await saveUserProfileToDatabase({
    email: body.email,
    hashedPassword,
  });

  const token = generateJwtToken(savedUser);

  setJwtCookie(response, token);

  response.status(201).json({
    success: true,
    message: 'User registered successfully.',
  });
  return;
};

export const handleUserLogin = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const body = await validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
    request,
    response,
  );
  const user = await retrieveUserProfileFromDatabaseByEmail(body.email);

  if (
    !user ||
    !(await getIsPasswordValid(body.password, user.hashedPassword))
  ) {
    response.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
    return;
  }

  const token = generateJwtToken(user);
  setJwtCookie(response, token);
  response
    .status(200)
    .json({ success: true, message: 'Logged in successfully' });
  return;
};

export const handleUserLogout = async (
  request: Request,
  response: Response,
) => {
  clearJwtCookie(response);
  response.status(200).json({
    success: true,
    message: 'Logout Successfully',
  });
};
