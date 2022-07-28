import { ReadAllUsersUseCase } from '@/use-cases/user/read-all-users';
import { ReadAllUsersController } from '@/adapters/controllers/user/read-all-users-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeAllReadUsersController(): IController {
  const userRepository = new UserRepository();
  const readAllUsersUseCase = new ReadAllUsersUseCase(userRepository);
  const readAllUsersController = new ReadAllUsersController(readAllUsersUseCase);
  return readAllUsersController;
}
