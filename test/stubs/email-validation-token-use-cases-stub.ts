import { makeEmailVerificationTokenRepository, makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs';
import { AddEmailVerificationTokenUseCase } from '@/use-cases/email-verification-token/add-email-verification-token';

export const makeAddEmailVerificationTokenUseCase = (): AddEmailVerificationTokenUseCase => {
  const EmailVerificationTokenRepositoryStub = makeEmailVerificationTokenRepository();
  const tokenGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const AddEmailVerificationTokenUseCaseStub = new AddEmailVerificationTokenUseCase(
    EmailVerificationTokenRepositoryStub, tokenGeneratorStub,
  );
  return AddEmailVerificationTokenUseCaseStub;
};
