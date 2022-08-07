import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';
import { IController } from '@/adapters/controllers/interfaces';
import { UserHasRoleRepository } from '@/infra/repositories';
import { makeReadAllRolesFromUserValidationFactory } from '@/main/factories/user-has-role';
import { ReadAllRolesFromUserController } from '@/adapters/controllers/user-has-role/read-all-roles-from-user';

export function makeReadAllRolesFromUserController(): IController {
  const userHasRoleRepository = new UserHasRoleRepository();
  const readAllRolesFromUserUseCase = new ReadAllRolesFromUserUseCase(userHasRoleRepository);
  const readAllRolesFromUserController = new ReadAllRolesFromUserController(
    makeReadAllRolesFromUserValidationFactory(), readAllRolesFromUserUseCase,
  );
  return readAllRolesFromUserController;
}
