import { DeleteUserUseCase } from '@/use-cases/delete-user';
import { DeleteUserController } from '@/adapters/controllers/delete-user-controller';
import { IController } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeDeleteUserController(): IController {
  const userRepository = new UserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deleteUserMiddleware = new DeleteUserController(deleteUserUseCase);
  return deleteUserMiddleware;
}
