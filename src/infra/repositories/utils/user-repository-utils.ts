import { Role } from '@prisma/client';
import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

export function getUserRoles(userHasRoles: Array<{ Roles: Role; }> = []):
  [] | IRoleRepositoryReturnData[] {
  const userRoles = userHasRoles.map((userHasRole) => userHasRole.Roles);
  return userRoles;
}
