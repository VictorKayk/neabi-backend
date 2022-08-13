import { makeEmailService } from '@/test/stubs/email-service-stub';
import { SendVerificationTokenUseCase } from '@/use-cases/email-service/send-verification-token';

export const makeSendVerificationTokenUseCase = (): SendVerificationTokenUseCase => {
  const sendVerificationTokenUseCase = new SendVerificationTokenUseCase(
    'http://url.test', makeEmailService(),
  );
  return sendVerificationTokenUseCase;
};
