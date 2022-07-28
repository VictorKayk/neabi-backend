import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { SignUpController } from '@/adapters/controllers/user/sign-up-controller';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { makeSignUpValidationFactory } from '@/main/factories/user';
import env from '@/main/config/env';

export function makeSignUpController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const uuidAdapter = new UuidAdapter();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const signUpUseCase = new SignUpUseCase(userRepository, bcryptAdapter, uuidAdapter, jwtAdapter);
  const signUpController = new SignUpController(makeSignUpValidationFactory(), signUpUseCase);
  return signUpController;
}
