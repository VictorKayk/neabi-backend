import {
  signUpPath,
  signInPath,
  externalSignInPath,
  userPath,
  userByIdPath,
  readAllUsersPath,
  sendResetUserPasswordTokenPath,
  verifyResetUserPasswordTokenPath,
  sendVerificationTokenPath,
  verifyVerificationTokenPath,
} from '@/main/docs/paths/user';

export const userPathsDocs = {
  '/signup': signUpPath,
  '/signin': signInPath,
  '/user/google': externalSignInPath,
  '/user': userPath,
  '/user/{userId}': userByIdPath,
  '/user/all': readAllUsersPath,
  '/user/reset-password/token': sendResetUserPasswordTokenPath,
  '/user/{userId}/reset-password/token/{token}': verifyResetUserPasswordTokenPath,
  '/user/verification/token': sendVerificationTokenPath,
  '/user/{userId}/verification/token/{token}': verifyVerificationTokenPath,
};
