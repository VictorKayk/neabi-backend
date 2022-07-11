import { UserBuilder } from '@/test/builders/user-builder';
import { SignUp } from '@/use-cases/signup';
import {
  IUserRepositoryData,
  IUserRepository,
  IHasher,
  IIdGenerator,
  IEncrypter,
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

export const makeSignUpUseCase = (): SignUp => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();
  return new SignUp(userRepository, hasher, idGenerator, encrypter);
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
