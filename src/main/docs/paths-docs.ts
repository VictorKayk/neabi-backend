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
  readAllRolesPath,
  roleByIdPath,
  readAllRolesFromUserPath,
  userHasRoleByIdPath,
  sendVerificationTokenPath,
  verifyVerificationTokenPath,
  createPostPath,
  postBySlugPath,
  readAllPostsPath,
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
  '/user/verification/token': sendVerificationTokenPath,
  '/user/{userId}/verification/token/{token}': verifyVerificationTokenPath,
  '/role': createRolePath,
  '/role/all': readAllRolesPath,
  '/role/{roleId}': roleByIdPath,
  '/user/{userId}/role/all': readAllRolesFromUserPath,
  '/user/{userId}/role/{roleId}': userHasRoleByIdPath,
  '/post': createPostPath,
  '/post/{slug}': postBySlugPath,
  '/post/all': readAllPostsPath,
};
