import { makeVerificationTokenRepository, makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';

export const makeAddVerificationTokenUseCase = (): AddVerificationTokenUseCase => {
  const VerificationTokenRepositoryStub = makeVerificationTokenRepository();
  const tokenGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const AddVerificationTokenUseCaseStub = new AddVerificationTokenUseCase(
    VerificationTokenRepositoryStub, tokenGeneratorStub,
  );
  return AddVerificationTokenUseCaseStub;
};
