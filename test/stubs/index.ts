import { UserBuilder } from '@/test/builders/user-builder';
import { Either, success } from '@/shared';
import { UnauthorizedError } from '@/use-cases/errors';
import { SignUp } from '@/use-cases/sign-up';
import { SignIn } from '@/use-cases/sign-in';
import { Authentication } from '@/use-cases/authentication';
import {
  IUserRepositoryData,
  IUserRepository,
  IHasher,
  IHashCompare,
  IIdGenerator,
  IEncrypter,
  IDecrypter,
  IPayload,
  IUserEditableData,
} from '@/use-cases/interfaces';
import { IHttpRequest, IValidation } from '@/adapters/interfaces';

export const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async findByEmail(email: string): Promise<IUserRepositoryData | null> {
      return null;
    }

    async findById(id: string): Promise<IUserRepositoryData | null> {
      return null;
    }

    async add(userData: IUserRepositoryData): Promise<IUserRepositoryData> {
      return userData;
    }

    async updateByEmail(email: string, userData: IUserEditableData): Promise<IUserRepositoryData> {
      const user = new UserBuilder();
      return user.build();
    }
  }
  return new UserRepositoryStub();
};

export const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return 'any_hash';
    }
  }
  return new HasherStub();
};

export const makeHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(hash: string, value: string): Promise<boolean> {
      return true;
    }
  }
  return new HashCompareStub();
};

export const makeIdGenerator = (): IIdGenerator => {
  class IdGeneratorStub implements IIdGenerator {
    async generate(): Promise<string> {
      return 'any_id';
    }
  }
  return new IdGeneratorStub();
};

export const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return 'any_encrypted_string';
    }
  }
  return new EncrypterStub();
};

export const makeDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(value: string): Promise<Either<UnauthorizedError, IPayload>> {
      return success({
        id: 'any_id',
      });
    }
  }
  return new DecrypterStub();
};

export const makeSignUpUseCase = (): SignUp => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();
  return new SignUp(userRepository, hasher, idGenerator, encrypter);
};

export const makeSignInUseCase = (): SignIn => {
  const userRepository = makeUserRepository();
  const hashCompare = makeHashCompare();
  const encrypter = makeEncrypter();
  return new SignIn(userRepository, hashCompare, encrypter);
};

export const makeAuthenticationUseCase = (): Authentication => {
  const userRepository = makeUserRepository();
  const decrypter = makeDecrypter();
  return new Authentication(userRepository, decrypter);
};

export const makeFakeRequest = (): IHttpRequest => {
  const user = new UserBuilder();
  return {
    body: {
      name: user.build().name,
      email: user.build().email,
      password: user.build().password,
      passwordConfirmation: user.build().password,
    },
  };
};

export const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
