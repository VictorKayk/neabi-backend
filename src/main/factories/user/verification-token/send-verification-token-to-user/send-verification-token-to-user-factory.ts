import { SendVerificationTokenToUserController } from '@/adapters/controllers/user/verification-token/send-verification-token-to-user';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { VerificationTokenRepository, UserRepository } from '@/infra/repositories';
import { makeSendVerificationTokenToUserValidationFactory } from '@/main/factories/user/verification-token';
import { AddVerificationTokenUseCase } from '@/use-cases/user/verification-token/add-verification-token';
import { EmailService } from '@/infra/services';
import { SendEmailService } from '@/use-cases/services/email-service/send-email';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeSendVerificationTokenToUserController(): IController {
  const uuidAdapter = new UuidAdapter();

  const userRepository = new UserRepository();
  const readUserUseCase = new ReadUserUseCase(userRepository);

  const salt = env.bcryptSalt;
  const bcryptAdapter = new BcryptAdapter(salt);

  const verificationTokenRepository = new VerificationTokenRepository();
  const addVerificationTokenUseCase = new AddVerificationTokenUseCase(
    verificationTokenRepository, uuidAdapter, uuidAdapter, bcryptAdapter,
  );

  const emailService = new EmailService(
    env.emailHost,
    env.emailPort,
    env.emailFrom,
    {
      user: env.emailUser,
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      refreshToken: env.googleRefreshToken,
    },
  );
  const sendEmailService = new SendEmailService(emailService);

  const sendVerificationTokenToUserController = new SendVerificationTokenToUserController(
    makeSendVerificationTokenToUserValidationFactory(),
    addVerificationTokenUseCase,
    readUserUseCase,
    sendEmailService,
    env.baseUrl,
  );
  return sendVerificationTokenToUserController;
}
