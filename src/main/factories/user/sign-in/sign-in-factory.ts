import { SignInUseCase } from '@/use-cases/user/sign-in';
import { SignInController } from '@/adapters/controllers/user/sign-in';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { makeSignInValidationFactory } from '@/main/factories/user';
import env from '@/main/config/env';

export function makeSignInController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const signInUseCase = new SignInUseCase(userRepository, bcryptAdapter, jwtAdapter);
  const signInController = new SignInController(makeSignInValidationFactory(), signInUseCase);
  return signInController;
}
