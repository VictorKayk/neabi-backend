import {
  readAllRolesFromUserPath,
  userHasRoleByIdPath,
} from '@/main/docs/paths/user-has-role';

export const userHasRolePathsDocs = {
  '/user/{userId}/role/all': readAllRolesFromUserPath,
  '/user/{userId}/role/{roleId}': userHasRoleByIdPath,
};
