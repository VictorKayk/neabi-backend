import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { ExternalSignInController } from '@/adapters/controllers/user/external-sign-in';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository, VerificationTokenRepository } from '@/infra/repositories';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { JwtAdapter } from '@/infra/criptography';
import { makeExternalSignInValidationFactory } from '@/main/factories/user';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';
import { EmailService } from '@/infra/services';
import { SendVerificationTokenUseCase } from '@/use-cases/email-service/send-verification-token';
import env from '@/main/config/env';

export function makeExternalSignInController(): IController {
  const userRepository = new UserRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const uuidAdapter = new UuidAdapter();

  const externalSignInUseCase = new ExternalSignInUseCase(userRepository, uuidAdapter, jwtAdapter);

  const verificationTokenRepository = new VerificationTokenRepository();
  const addVerificationTokenUseCase = new AddVerificationTokenUseCase(
    verificationTokenRepository, uuidAdapter,
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
  const sendVerificationTokenUseCase = new SendVerificationTokenUseCase(env.baseUrl, emailService);

  const externalSignInController = new ExternalSignInController(
    makeExternalSignInValidationFactory(),
    externalSignInUseCase,
    addVerificationTokenUseCase,
    sendVerificationTokenUseCase,
  );
  return externalSignInController;
}
