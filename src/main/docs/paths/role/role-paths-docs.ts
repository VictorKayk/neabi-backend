import {
  createRolePath,
  readAllRolesPath,
  roleByIdPath,
} from '@/main/docs/paths/role';

export const rolePathsDocs = {
  '/role': createRolePath,
  '/role/all': readAllRolesPath,
  '/role/{roleId}': roleByIdPath,
};
