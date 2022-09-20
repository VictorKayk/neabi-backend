import { AuthenticationUseCase } from '@/use-cases/authentication';
import { AuthorizationUseCase } from '@/use-cases/authorization';
import { makeDecrypter, makeUserHasRoleRepository, makeUserRepository } from '@/test/stubs';

export const makeAuthenticationUseCase = (): AuthenticationUseCase => {
  const userRepository = makeUserRepository();
  const decrypter = makeDecrypter();
  return new AuthenticationUseCase(userRepository, decrypter);
};

export const makeAuthorizationUseCase = (): AuthorizationUseCase => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  return new AuthorizationUseCase(userHasRoleRepository);
};
