import { RemoveRoleFromUserUseCase } from '@/use-cases/user-has-role/remove-role-from-user';
import { IController } from '@/adapters/controllers/interfaces';
import { UserHasRoleRepository } from '@/infra/repositories';
import { makeRemoveRoleFromUserValidationFactory } from '@/main/factories/user-has-role';
import { RemoveRoleFromUserController } from '@/adapters/controllers/user-has-role/remove-role-from-user';

export function makeRemoveRoleFromUserController(): IController {
  const userHasRoleRepository = new UserHasRoleRepository();
  const removeRoleFromUserUseCase = new RemoveRoleFromUserUseCase(userHasRoleRepository);
  const removeRoleFromUserController = new RemoveRoleFromUserController(
    makeRemoveRoleFromUserValidationFactory(), removeRoleFromUserUseCase,
  );
  return removeRoleFromUserController;
}
