import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { SignInUseCase } from '@/use-cases/user/sign-in';
import { AuthenticationUseCase } from '@/use-cases/authentication';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import {
  makeUserRepository,
  makeHasher,
  makeUniversallyUniqueIdentifierGenerator,
  makeEncrypter,
  makeHashCompare,
  makeDecrypter,
} from '@/test/stubs';

export const makeSignUpUseCase = (): SignUpUseCase => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const encrypter = makeEncrypter();
  return new SignUpUseCase(userRepository, hasher, idGenerator, encrypter);
};

export const makeSignInUseCase = (): SignInUseCase => {
  const userRepository = makeUserRepository();
  const hashCompare = makeHashCompare();
  const encrypter = makeEncrypter();
  return new SignInUseCase(userRepository, hashCompare, encrypter);
};

export const makeExternalSignInUseCase = (): ExternalSignInUseCase => {
  const userRepository = makeUserRepository();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const encrypter = makeEncrypter();
  return new ExternalSignInUseCase(userRepository, idGenerator, encrypter);
};

export const makeAuthenticationUseCase = (): AuthenticationUseCase => {
  const userRepository = makeUserRepository();
  const decrypter = makeDecrypter();
  return new AuthenticationUseCase(userRepository, decrypter);
};

export const makeUpdateUserUseCase = (): UpdateUserUseCase => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  return new UpdateUserUseCase(userRepository, hasher);
};
