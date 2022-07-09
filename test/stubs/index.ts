import {
  IUserData,
  IUserRepository,
  IHasher,
  IIdGenerator,
  IEncrypter,
} from '@/use-cases/interfaces';
import { SignUp } from '@/use-cases/signup';

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

export const makeUseCase = (): SignUp => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();
  return new SignUp(userRepository, hasher, idGenerator, encrypter);
};
