import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { SignUpController } from '@/adapters/controllers/user/sign-up';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { VerificationTokenRepository, UserRepository } from '@/infra/repositories';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { makeSignUpValidationFactory } from '@/main/factories/user';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';
import { EmailService } from '@/infra/services';
import { SendVerificationTokenUseCase } from '@/use-cases/email-service/send-verification-token';
import env from '@/main/config/env';

export function makeSignUpController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const uuidAdapter = new UuidAdapter();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);

  const signUpUseCase = new SignUpUseCase(userRepository, bcryptAdapter, uuidAdapter, jwtAdapter);

  const verificationTokenRepository = new VerificationTokenRepository();
  const addVerificationTokenUseCase = new AddVerificationTokenUseCase(
    verificationTokenRepository, uuidAdapter,
  );

  const emailService = new EmailService(
    env.emailHost,
    env.emailPort,
    env.emailFrom,
    { user: env.emailUser, pass: env.emailPassword },
  );
  const sendVerificationTokenUseCase = new SendVerificationTokenUseCase(env.baseUrl, emailService);

  const signUpController = new SignUpController(
    makeSignUpValidationFactory(),
    signUpUseCase,
    addVerificationTokenUseCase,
    sendVerificationTokenUseCase,
  );
  return signUpController;
}
