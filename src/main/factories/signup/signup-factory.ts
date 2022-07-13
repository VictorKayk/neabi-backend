import { SignUp } from '@/use-cases/signup';
import { SignUpController } from '@/adapters/controllers/signup-controller';
import { IController } from '@/adapters/interfaces';
import { UuidAdapter } from '@/infra/uuid-adapter';
import { UserRepository } from '@/infra/repositories';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { makeSignUpValidationFactory } from '@/main/factories/signup';
import env from '@/main/config/env';

export function makeSignUpController(): IController {
  const salt = 12;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const uuidAdapter = new UuidAdapter();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const signUpUseCase = new SignUp(userRepository, bcryptAdapter, uuidAdapter, jwtAdapter);
  const signUpController = new SignUpController(makeSignUpValidationFactory(), signUpUseCase);
  return signUpController;
}
