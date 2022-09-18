import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { ReadRoleByIdUseCase } from '@/use-cases/role/read-role-by-id';
import { ReadAllRolesUseCase } from '@/use-cases/role/read-all-roles';
import { UpdateRoleByIdUseCase } from '@/use-cases/role/update-role-by-id';
import { DeleteRoleByIdUseCase } from '@/use-cases/role/delete-role-by-id';
import { makeRoleRepository, makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';

export const makeCreateRoleUseCase = (): CreateRoleUseCase => {
  const roleRepository = makeRoleRepository();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  return new CreateRoleUseCase(roleRepository, idGenerator);
};

export const makeReadRoleByIdUseCase = (): ReadRoleByIdUseCase => {
  const roleRepository = makeRoleRepository();
  return new ReadRoleByIdUseCase(roleRepository);
};

export const makeReadRoleByRoleNameUseCase = (): ReadRoleByRoleNameUseCase => {
  const roleRepository = makeRoleRepository();
  return new ReadRoleByRoleNameUseCase(roleRepository);
};

export const makeReadAllRolesUseCase = (): ReadAllRolesUseCase => {
  const roleRepository = makeRoleRepository();
  return new ReadAllRolesUseCase(roleRepository);
};

export const makeDeleteRoleByIdUseCase = (): DeleteRoleByIdUseCase => {
  const roleRepository = makeRoleRepository();
  return new DeleteRoleByIdUseCase(roleRepository);
};

export const makeUpdateRoleByIdUseCase = (): UpdateRoleByIdUseCase => {
  const roleRepository = makeRoleRepository();
  return new UpdateRoleByIdUseCase(roleRepository);
};
