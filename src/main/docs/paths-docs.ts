import {
  signUpPath,
  signInPath,
  externalSignInPath,
  userPath,
  userByIdPath,
  allUsersPath,
  sendResetUserPasswordTokenPath,
  verifyResetUserPasswordTokenPath,
} from '@/main/docs/paths';

export default {
  '/signup': signUpPath,
  '/signin': signInPath,
  '/user/google': externalSignInPath,
  '/user': userPath,
  '/user/{userId}': userByIdPath,
  '/user/all': allUsersPath,
  '/user/reset-password/token': sendResetUserPasswordTokenPath,
  '/user/{userId}/reset-password/token/{token}': verifyResetUserPasswordTokenPath,
  // '/role': ,
  // '/role/all': ,
  // '/role/{roleId}': ,
  // '/user/{userId}/role/all': ,
  // '/user/{userId}/role/{roleId}': ,
  // '/user/verification/token': ,
  // '/user/{userId}/verification/token/{token}': ,
};
