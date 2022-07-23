import { ReadUserUseCase } from '@/use-cases/read-user';
import { ReadUserController } from '@/adapters/controllers/read-user-controller';
import { IController } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeReadUserController(): IController {
  const userRepository = new UserRepository();
  const readUserUseCase = new ReadUserUseCase(userRepository);
  const readUserController = new ReadUserController(readUserUseCase);
  return readUserController;
}
