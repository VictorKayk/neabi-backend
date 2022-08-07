import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { IController } from '@/adapters/controllers/interfaces';
import { UserHasRoleRepository } from '@/infra/repositories';
import { makeAddRoleToUserValidationFactory } from '@/main/factories/user-has-role';
import { AddRoleToUserController } from '@/adapters/controllers/user-has-role/add-role-to-user';

export function makeAddRoleToUserController(): IController {
  const userHasRoleRepository = new UserHasRoleRepository();
  const addRoleToUserUseCase = new AddRoleToUserUseCase(userHasRoleRepository);
  const addRoleToUserController = new AddRoleToUserController(
    makeAddRoleToUserValidationFactory(), addRoleToUserUseCase,
  );
  return addRoleToUserController;
}
