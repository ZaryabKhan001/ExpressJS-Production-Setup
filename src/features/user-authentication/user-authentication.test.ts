import { createId } from '@paralleldrive/cuid2';
import request from 'supertest';
import { describe, expect, onTestFinished, test } from 'vitest';

import { buildApp } from '~/app.js';

import { createPopulatedUserProfile } from '../user-profile/user-profile.factories.js';
import {
  deleteUserProfileFromDatabaseById,
  retrieveUserProfileFromDatabaseByEmail,
  saveUserProfileToDatabase,
} from '../user-profile/user-profile.model.js';
import {
  generateJwtToken,
  hashPassword,
} from './user-authentication.helper.js';

// Setup of express server that we are going to use.
export const setup = async ({
  password = 'password',
}: { password?: string } = {}) => {
  const app = buildApp();

  const userProfile = await saveUserProfileToDatabase(
    createPopulatedUserProfile({
      hashedPassword: await hashPassword(password),
    }),
  );

  onTestFinished(async () => {
    await deleteUserProfileFromDatabaseById(userProfile.id);
  });

  return { app, userProfile };
};

/** Login Tests */
// 1: Valid credentials
// 2: Valid credentials for non existing user
// 3: Invalid credentials
// 4: Valid email but wrong password

describe('/api/v1/login', () => {
  test('given: valid credentials for an existing user, should: return a 200 and set a JWT cookie', async () => {
    const password = createId();

    const { app, userProfile } = await setup({ password });

    const actual = await request(app)
      .post('/api/v1/login')
      .send({ email: userProfile.email, password })
      .expect(200);

    expect(actual.body).toEqual({
      success: true,
      message: 'Logged in successfully',
    });

    const cookies = actual.headers['set-cookie'] as unknown as string[];
    expect(cookies).toBeDefined();
    expect(cookies.some(cookie => cookie.includes('jwt='))).toEqual(true);
  });

  test('given: valid credentials for non-existing user, should: return a 401', async () => {
    const { app } = await setup();

    const actual = await request(app)
      .post('/api/v1/login')
      .send({ email: 'non-existing@test.com', password: 'password' })
      .expect(401);

    expect(actual.body).toEqual({
      success: false,
      message: 'Invalid credentials',
    });
  });

  test('given: valid credentials, but wrong password for an existing user, should return 401', async () => {
    const { app, userProfile } = await setup();

    const actual = await request(app)
      .post('/api/v1/login')
      .send({ email: userProfile.email, password: 'wrongPassword' })
      .expect(401);

    expect(actual.body).toEqual({
      success: false,
      message: 'Invalid credentials',
    });
  });

  test('given: invalid credentials, should: return a 400', async () => {
    const { app } = await setup();

    const { body: actual } = await request(app)
      .post('/api/v1/login')
      .send({})
      .expect(400);
    const expected = {
      message: 'Bad Request',
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['email'],
          received: 'undefined',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['password'],
          received: 'undefined',
        },
      ],
    };

    expect(actual).toEqual(expected);
  });
});

/** Register Tests */
// 1: Valid Registration Data
// 2: Registration, An email that already exists

describe('/api/v1/register', () => {
  test('given: Valid registration data, should: create a user and return 201', async () => {
    const app = buildApp();
    const email = `${createId()}@example.com`;
    const password = 'password123';

    const actual = await request(app)
      .post('/api/v1/register')
      .send({ email, password })
      .expect(201);

    expect(actual.body).toEqual({
      success: true,
      message: 'User registered successfully.',
    });

    // verify that user is created in database
    const createdUser = await retrieveUserProfileFromDatabaseByEmail(email);
    expect(createdUser).toBeDefined();
    expect(createdUser?.email).toEqual(email);

    // cleanup
    if (createdUser) {
      await deleteUserProfileFromDatabaseById(createdUser?.id);
    }
  });

  test('given: An email that already exists, should: return 409', async () => {
    const password = createId();

    const { app, userProfile } = await setup({ password });

    const actual = await request(app)
      .post('/api/v1/register')
      .send({ email: userProfile.email, password: 'password123' })
      .expect(409);

    expect(actual.body).toEqual({
      success: false,
      message: 'User already exists.',
    });
  });
  test('given: invalid registration data, should: return a 400', async () => {
    const app = buildApp();

    const { body: actual } = await request(app)
      .post('/api/v1/register')
      .send({})
      .expect(400);

    expect(actual).toEqual({
      message: 'Bad Request',
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['email'],
          received: 'undefined',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['password'],
          received: 'undefined',
        },
      ],
    });
  });
});

/** Logout Tests */
describe('/api/v1/logout', () => {
  test('should: return 401 if user is not authenticated', async () => {
    const app = buildApp();

    const response = await request(app).post('/api/v1/logout').expect(401);

    expect(response.body).toEqual({
      success: false,
      message: 'Unauthenticated!',
    });
  });

  test('should: clear JWT cookie and return 200 for authenticated user', async () => {
    const password = createId();
    const { app, userProfile } = await setup({ password });

    const token = generateJwtToken(userProfile);

    const response = await request(app)
      .post('/api/v1/logout')
      .set('Cookie', [`jwt=${token}`])
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: 'Logout Successfully',
    });

    // verify cookie is cleared
    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies).toBeDefined();
    expect(cookies).toEqual([
      'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
    ]);
  });
});
