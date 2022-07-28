import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { ReadUserByIdController } from '@/adapters/controllers/user/read-user-by-id-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeReadUserByIdController(): IController {
  const userRepository = new UserRepository();
  const readUserUseCase = new ReadUserUseCase(userRepository);
  const readUserByIdController = new ReadUserByIdController(readUserUseCase);
  return readUserByIdController;
}
