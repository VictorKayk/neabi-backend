
import { SendResetUserPasswordTokenToUserController } from '@/adapters/controllers/user/reset-user-password/send-reset-user-password-token';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { ResetUserPasswordTokenRepository, UserRepository } from '@/infra/repositories';
import { makeSendResetUserPasswordTokenToUserValidationFactory } from '@/main/factories/user/reset-user-password';
import { AddResetUserPasswordTokenUseCase } from '@/use-cases/user/reset-user-password/add-reset-user-password-token';
import { EmailService } from '@/infra/services';
import { SendEmailService } from '@/use-cases/services/email-service/send-email';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeSendResetUserPasswordTokenToUserController(): IController {
  const uuidAdapter = new UuidAdapter();

  const userRepository = new UserRepository();
  const readUserUseCase = new ReadUserUseCase(userRepository);

  const salt = env.bcryptSalt;
  const bcryptAdapter = new BcryptAdapter(salt);

  const resetUserPasswordTokenRepository = new ResetUserPasswordTokenRepository();
  const addResetUserPasswordTokenUseCase = new AddResetUserPasswordTokenUseCase(
    resetUserPasswordTokenRepository, uuidAdapter, uuidAdapter, bcryptAdapter,
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

  const sendResetUserPasswordTokenToUserController = new SendResetUserPasswordTokenToUserController(
    makeSendResetUserPasswordTokenToUserValidationFactory(),
    addResetUserPasswordTokenUseCase,
    readUserUseCase,
    sendEmailService,
    env.baseUrl,
  );
  return sendResetUserPasswordTokenToUserController;
}
