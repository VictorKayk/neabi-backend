import { makeDeleteUserByIdValidationFactory } from '@/main/factories/user';
import { DeleteUserUseCase } from '@/use-cases/user/delete-user';
import { DeleteUserByIdController } from '@/adapters/controllers/user/delete-user-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeDeleteUserByIdController(): IController {
  const userRepository = new UserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deleteUserByIdController = new DeleteUserByIdController(
    makeDeleteUserByIdValidationFactory(), deleteUserUseCase,
  );
  return deleteUserByIdController;
}
