import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { ReadRoleByIdUseCase } from '@/use-cases/role/read-role-by-id';
import { makeRoleRepository, makeIdGenerator } from '@/test/stubs';

export const makeCreateRoleUseCase = (): CreateRoleUseCase => {
  const roleRepository = makeRoleRepository();
  const idGenerator = makeIdGenerator();
  return new CreateRoleUseCase(roleRepository, idGenerator);
};

export const makeReadRoleByIdUseCase = (): ReadRoleByIdUseCase => {
  const roleRepository = makeRoleRepository();
  return new ReadRoleByIdUseCase(roleRepository);
};
