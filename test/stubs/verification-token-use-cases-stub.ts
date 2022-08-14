import { makeVerificationTokenRepository, makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';
import { makeEmailService } from '@/test/stubs/email-service-stub';
import { SendVerificationTokenUseCase } from '@/use-cases/verification-token/send-verification-token';

export const makeAddVerificationTokenUseCase = (): AddVerificationTokenUseCase => {
  const VerificationTokenRepositoryStub = makeVerificationTokenRepository();
  const tokenGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const AddVerificationTokenUseCaseStub = new AddVerificationTokenUseCase(
    VerificationTokenRepositoryStub, tokenGeneratorStub,
  );
  return AddVerificationTokenUseCaseStub;
};

export const makeSendVerificationTokenUseCase = (): SendVerificationTokenUseCase => {
  const sendVerificationTokenUseCase = new SendVerificationTokenUseCase(
    'http://url.test', makeEmailService(),
  );
  return sendVerificationTokenUseCase;
};
