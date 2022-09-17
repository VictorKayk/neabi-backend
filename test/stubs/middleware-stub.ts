import { AuthenticationUseCase } from '@/use-cases/authentication';
import { AuthorizationUseCase } from '@/use-cases/authorization';
import { makeDecrypter } from './encrypter-decrypter-stub';
import { makeUserHasRoleRepository } from './user-has-role-repository-stub';
import { makeUserRepository } from './user-repository-stub';

export const makeAuthenticationUseCase = (): AuthenticationUseCase => {
  const userRepository = makeUserRepository();
  const decrypter = makeDecrypter();
  return new AuthenticationUseCase(userRepository, decrypter);
};

export const makeAuthorizationUseCase = (): AuthorizationUseCase => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  return new AuthorizationUseCase(userHasRoleRepository);
};
