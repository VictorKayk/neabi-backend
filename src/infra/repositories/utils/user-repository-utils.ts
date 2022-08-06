import { Role } from '@prisma/client';
import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

export function getUserRoles(userHasRoles: Array<{ roles: Role; }> = []):
  [] | IRoleRepositoryReturnData[] {
  const userRoles = userHasRoles.map((userHasRole) => userHasRole.roles);
  return userRoles;
}
