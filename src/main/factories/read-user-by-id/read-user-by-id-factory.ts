import { ReadUserUseCase } from '@/use-cases/read-user';
import { ReadUserByIdController } from '@/adapters/controllers/read-user-by-id-controller';
import { IController } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';

export function makeReadUserByIdController(): IController {
  const userRepository = new UserRepository();
  const readUserUseCase = new ReadUserUseCase(userRepository);
  const readUserByIdController = new ReadUserByIdController(readUserUseCase);
  return readUserByIdController;
}
