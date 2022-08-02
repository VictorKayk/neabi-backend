import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { makeUserHasRoleRepository } from '@/test/stubs';

export const makeAddRoleToUserUseCase = (): AddRoleToUserUseCase => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  return new AddRoleToUserUseCase(userHasRoleRepository);
};
