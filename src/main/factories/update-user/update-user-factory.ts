import { UpdateUserUseCase } from '@/use-cases/update-user';
import { UpdateUserController } from '@/adapters/controllers/update-user-controller';
import { IController } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeUpdateUserController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const signInUseCase = new UpdateUserUseCase(userRepository, bcryptAdapter);
  const signInController = new UpdateUserController(signInUseCase);
  return signInController;
}
