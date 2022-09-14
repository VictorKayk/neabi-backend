import { makeResetUserPasswordTokenRepository, makeUniversallyUniqueIdentifierGenerator, makeHasher } from '@/test/stubs';
import { AddResetUserPasswordTokenUseCase } from '@/use-cases/user/reset-user-password/add-reset-user-password-token';

export const makeAddResetUserPasswordTokenUseCase = (): AddResetUserPasswordTokenUseCase => {
  const ResetUserPasswordTokenRepositoryStub = makeResetUserPasswordTokenRepository();
  const idGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const tokenGeneratorStub = makeUniversallyUniqueIdentifierGenerator();
  const hasher = makeHasher();
  const AddResetUserPasswordTokenUseCaseStub = new AddResetUserPasswordTokenUseCase(
    ResetUserPasswordTokenRepositoryStub, idGeneratorStub, tokenGeneratorStub, hasher,
  );
  return AddResetUserPasswordTokenUseCaseStub;
};
