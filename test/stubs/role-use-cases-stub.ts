import { CreateRoleUseCase } from '@/use-cases/roles/create-role';
import { makeRoleRepository, makeIdGenerator } from '@/test/stubs';

export const makeCreateRoleUseCase = (): CreateRoleUseCase => {
  const roleRepository = makeRoleRepository();
  const idGenerator = makeIdGenerator();
  return new CreateRoleUseCase(roleRepository, idGenerator);
};
