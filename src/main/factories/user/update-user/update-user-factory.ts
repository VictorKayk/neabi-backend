import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { UpdateUserController } from '@/adapters/controllers/user/update-user-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeUpdateUserController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, bcryptAdapter);
  const updateUserController = new UpdateUserController(updateUserUseCase);
  return updateUserController;
}
