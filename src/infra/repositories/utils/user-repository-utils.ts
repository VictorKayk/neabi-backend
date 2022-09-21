import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

export function getUserRoles(userHasRoles: Array<{ Roles: IRoleRepositoryReturnData; }> = []):
  [] | IRoleRepositoryReturnData[] {
  const userRoles = userHasRoles.map((userHasRole) => userHasRole.Roles);
  return userRoles;
}
