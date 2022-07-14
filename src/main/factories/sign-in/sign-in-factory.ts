import { SignIn } from '@/use-cases/sign-in';
import { SignInController } from '@/adapters/controllers/sign-in-controller';
import { IController } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { makeSignInValidationFactory } from '@/main/factories/sign-in';
import env from '@/main/config/env';

export function makeSignInController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const signInUseCase = new SignIn(userRepository, bcryptAdapter, jwtAdapter);
  const signInController = new SignInController(makeSignInValidationFactory(), signInUseCase);
  return signInController;
}
