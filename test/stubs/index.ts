import { SignUp } from '@/use-cases/signup';
import {
  IUserData,
  IUserRepository,
  IHasher,
  IIdGenerator,
  IEncrypter,
} from '@/use-cases/interfaces';
import { IHttpRequest, IValidation } from '@/adapters/interfaces';

export const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async findByEmail(email: string): Promise<IUserData | null> {
      return null;
    }

    async findById(id: string): Promise<IUserData | null> {
      return null;
    }

    async add(userData: IUserData): Promise<IUserData> {
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

export const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@test.com',
    password: 'any_password_1',
    passwordConfirmation: 'any_password_1',
  },
});

export const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
