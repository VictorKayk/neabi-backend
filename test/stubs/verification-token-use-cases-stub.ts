import { makeVerificationTokenRepository, makeUniversallyUniqueIdentifierGenerator, makeHasher } from '@/test/stubs';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';

export const makeAddVerificationTokenUseCase = (): AddVerificationTokenUseCase => {
  const VerificationTokenRepositoryStub = makeVerificationTokenRepository();
  const idGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const tokenGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const hasher = makeHasher();
  const AddVerificationTokenUseCaseStub = new AddVerificationTokenUseCase(
    VerificationTokenRepositoryStub, idGeneratorStub, tokenGeneratorStub, hasher,
  );
  return AddVerificationTokenUseCaseStub;
};
