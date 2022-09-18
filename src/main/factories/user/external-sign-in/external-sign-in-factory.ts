import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { ExternalSignInController } from '@/adapters/controllers/user/external-sign-in';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository, UserHasRoleRepository, UserRepository } from '@/infra/repositories';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { JwtAdapter } from '@/infra/criptography';
import { makeExternalSignInValidationFactory } from '@/main/factories/user';
import env from '@/main/config/env';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';
import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';

export function makeExternalSignInController(): IController {
  const userRepository = new UserRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const uuidAdapter = new UuidAdapter();

  const externalSignInUseCase = new ExternalSignInUseCase(userRepository, uuidAdapter, jwtAdapter);
  const userHasRoleRepository = new UserHasRoleRepository();
  const readAllRolesFromUser = new ReadAllRolesFromUserUseCase(userHasRoleRepository);
  const roleRepository = new RoleRepository();
  const createRoleUseCase = new CreateRoleUseCase(roleRepository, uuidAdapter);
  const addRoleToUser = new AddRoleToUserUseCase(userHasRoleRepository);
  const readRoleByRoleName = new ReadRoleByRoleNameUseCase(roleRepository);

  const externalSignInController = new ExternalSignInController(
    makeExternalSignInValidationFactory(),
    externalSignInUseCase,
    readAllRolesFromUser,
    createRoleUseCase,
    addRoleToUser,
    readRoleByRoleName,
  );
  return externalSignInController;
}
