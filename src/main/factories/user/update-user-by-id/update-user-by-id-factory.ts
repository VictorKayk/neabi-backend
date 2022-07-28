import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { UpdateUserByIdController } from '@/adapters/controllers/user/update-user-by-id-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeUpdateUserByIdController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, bcryptAdapter);
  const updateUserByIdController = new UpdateUserByIdController(updateUserUseCase);
  return updateUserByIdController;
}
