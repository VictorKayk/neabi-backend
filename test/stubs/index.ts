import { UserBuilder } from '@/test/builders/user-builder';
import { Either, success } from '@/shared';
import { UnauthorizedError } from '@/use-cases/errors';
import { SignUpUseCase } from '@/use-cases/sign-up';
import { SignInUseCase } from '@/use-cases/sign-in';
import { AuthenticationUseCase } from '@/use-cases/authentication';
import { UpdateUserUseCase } from '@/use-cases/update-user';
import {
  IUserRepositoryData,
  IUserRepositoryReturnData,
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
    async findByEmail(email: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findById(id: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData> {
      return {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async updateByEmail(email: string, userData: IUserEditableData):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async updateById(id: string, userData: IUserEditableData):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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

export const makeSignUpUseCase = (): SignUpUseCase => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();
  return new SignUpUseCase(userRepository, hasher, idGenerator, encrypter);
};

export const makeSignInUseCase = (): SignInUseCase => {
  const userRepository = makeUserRepository();
  const hashCompare = makeHashCompare();
  const encrypter = makeEncrypter();
  return new SignInUseCase(userRepository, hashCompare, encrypter);
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

export const makeFakeRequest = (): IHttpRequest => {
  const user = new UserBuilder();
  return {
    body: {
      id: 'any_id',
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
