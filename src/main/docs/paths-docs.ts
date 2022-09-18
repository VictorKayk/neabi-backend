import {
  signUpPath,
  signInPath,
  externalSignInPath,
  userPath,
  userByIdPath,
  readAllUsersPath,
  sendResetUserPasswordTokenPath,
  verifyResetUserPasswordTokenPath,
  createRolePath,
} from '@/main/docs/paths';

export default {
  '/signup': signUpPath,
  '/signin': signInPath,
  '/user/google': externalSignInPath,
  '/user': userPath,
  '/user/{userId}': userByIdPath,
  '/user/all': readAllUsersPath,
  '/user/reset-password/token': sendResetUserPasswordTokenPath,
  '/user/{userId}/reset-password/token/{token}': verifyResetUserPasswordTokenPath,
  '/role': createRolePath,
  // '/role/all': ,
  // '/role/{roleId}': ,
  // '/user/{userId}/role/all': ,
  // '/user/{userId}/role/{roleId}': ,
  // '/user/verification/token': ,
  // '/user/{userId}/verification/token/{token}': ,
};
