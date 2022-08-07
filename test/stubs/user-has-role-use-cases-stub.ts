import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { RemoveRoleFromUserUseCase } from '@/use-cases/user-has-role/remove-role-from-user';
import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';
import { makeUserHasRoleRepository } from '@/test/stubs';

export const makeAddRoleToUserUseCase = (): AddRoleToUserUseCase => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  return new AddRoleToUserUseCase(userHasRoleRepository);
};

export const makeRemoveRoleFromUserUseCase = (): RemoveRoleFromUserUseCase => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  return new RemoveRoleFromUserUseCase(userHasRoleRepository);
};

export const makeReadAllRolesFromUserUseCase = (): ReadAllRolesFromUserUseCase => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  return new ReadAllRolesFromUserUseCase(userHasRoleRepository);
};
