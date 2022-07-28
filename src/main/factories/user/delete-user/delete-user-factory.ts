import { DeleteUserUseCase } from '@/use-cases/user/delete-user';
import { DeleteUserController } from '@/adapters/controllers/user/delete-user-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeDeleteUserController(): IController {
  const userRepository = new UserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);
  return deleteUserController;
}
