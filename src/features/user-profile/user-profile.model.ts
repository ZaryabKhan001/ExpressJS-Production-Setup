import { prisma } from '~/database.js';

import { Prisma, type UserProfile } from '../../../generated/prisma/client.js';

/* CREATE */

/**
 * Save a user profile to the database
 *
 * @param userProfile - The user profile to save
 * @returns The saved user profile
 */
export const saveUserProfileToDatabase = async (
  userProfile: Prisma.UserProfileCreateInput,
) => {
  return prisma.userProfile.create({ data: userProfile });
};

/* READ */

/**
 * Retrives a user profile by it's ID
 *
 * @param id - The id of the user profile
 * @returns The user profile or null
 */
export const retrieveUserProfileFromDatabaseById = async (
  id: UserProfile['id'],
) => {
  return prisma.userProfile.findUnique({ where: { id } });
};

/**
 * Retrives a user by it's email
 *
 * @param email - The email of the user profile
 * @returns The user profile or null
 */
export const retrieveUserProfileFromDatabaseByEmail = async (
  email: UserProfile['email'],
) => {
  return prisma.userProfile.findUnique({ where: { email } });
};

/**
 * Retrive multiple user profiles
 *
 * @param page - The page number (starting at 1)
 * @param pageSize - The no of profiles per page
 * @returns A list of user profiles
 */
export const retrieveMultipleUserProfilesFromDatabase = async ({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const skip = (page - 1) * pageSize;
  return prisma.userProfile.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });
};

/* UPDATE */
/**
 * Update a user profile by it's id
 *
 * @param id - The id of the user profile
 * @param data - The new data for the user profile
 * @returns The updated user profile
 */

export const updateUserProfileFromDatabaseById = async ({
  id,
  data,
}: {
  id: UserProfile['id'];
  data: Prisma.UserProfileUpdateInput;
}) => {
  return prisma.userProfile.update({ where: { id }, data });
};

/* DELETE */
/**
 * Delete a user type by it's id
 *
 * @param id - The id of the user profile
 * @returns The deleted user profile
 */
export const deleteUserProfileFromDatabaseById = async (
  id: UserProfile['id'],
) => {
  return prisma.userProfile.delete({ where: { id } });
};
