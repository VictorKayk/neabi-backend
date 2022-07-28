import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { ReadUserController } from '@/adapters/controllers/user/read-user-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeReadUserController(): IController {
  const userRepository = new UserRepository();
  const readUserUseCase = new ReadUserUseCase(userRepository);
  const readUserController = new ReadUserController(readUserUseCase);
  return readUserController;
}
