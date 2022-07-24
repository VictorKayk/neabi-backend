import { UpdateUserUseCase } from '@/use-cases/update-user';
import { UpdateUserByIdController } from '@/adapters/controllers/update-user-by-id-controller';
import { IController } from '@/adapters/interfaces';
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
