import { CreateRoleUseCase } from '@/use-cases/roles/create-role';
import { ReadRoleUseCase } from '@/use-cases/roles/read-role';
import { makeRoleRepository, makeIdGenerator } from '@/test/stubs';

export const makeCreateRoleUseCase = (): CreateRoleUseCase => {
  const roleRepository = makeRoleRepository();
  const idGenerator = makeIdGenerator();
  return new CreateRoleUseCase(roleRepository, idGenerator);
};

export const makeReadRoleUseCase = (): ReadRoleUseCase => {
  const roleRepository = makeRoleRepository();
  return new ReadRoleUseCase(roleRepository);
};
