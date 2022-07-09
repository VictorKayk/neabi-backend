import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import { SignUp } from '@/use-cases/signup';
import {
  IUserData,
  IUserRepository,
  IHasher,
  IIdGenerator,
} from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors/existing-user-error';
import { UserBuilder } from '@/test/builders/user-builder';

const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async findByEmail(email: string): Promise<IUserData | null> {
      return null;
    }
  }
  return new UserRepositoryStub();
};

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(str: string): Promise<string> {
      return 'any_hash';
    }
  }
  return new HasherStub();
};

const makeIdGenerator = (): IIdGenerator => {
  class IdGeneratorStub implements IIdGenerator {
    async generate(): Promise<string> {
      return 'any_id';
    }
  }
  return new IdGeneratorStub();
};

type SutTypes = {
  userRepository: IUserRepository,
  hasher: IHasher,
  idGenerator: IIdGenerator,
  sut: SignUp,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const sut = new SignUp(userRepository, hasher, idGenerator);
  const user = new UserBuilder();
  return {
    userRepository,
    hasher,
    idGenerator,
    sut,
    user,
  };
};

describe('SignUp Use Case', () => {
  it('Should call user entity with correct values', async () => {
    const { sut, user } = makeSut();
    const userSpy = jest.spyOn(User, 'create');
    await sut.execute(user.build());
    expect(userSpy)
      .toHaveBeenCalledWith(user.build().name, user.build().email, user.build().password);
  });

  it('Should return an error if name is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute(user.emptyName().build());
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidNameError(''));
  });

  it('Should return an error if email is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute(user.emptyEmail().build());
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });

  it('Should return an error if password is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute(user.emptyPassword().build());
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidPasswordError(''));
  });

  it('Should call findByEmail with correct email', async () => {
    const { sut, user, userRepository } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'findByEmail');
    await sut.execute(user.build());
    expect(userRepositorySpy).toHaveBeenCalledWith(user.build().email);
  });

  it('Should throw if findByEmail throws', async () => {
    const { sut, userRepository, user } = makeSut();
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user already exists', async () => {
    const { sut, userRepository, user } = makeSut();
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve(user.build())));
    const error = await sut.execute(user.build());
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new ExistingUserError());
  });

  it('Should call Hasher with correct password', async () => {
    const { sut, user, hasher } = makeSut();
    const hasherSpy = jest.spyOn(hasher, 'hash');
    await sut.execute(user.build());
    expect(hasherSpy).toHaveBeenCalledWith(user.build().password);
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, user, hasher } = makeSut();
    jest.spyOn(hasher, 'hash').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if IdGenerator throws', async () => {
    const { sut, user, idGenerator } = makeSut();
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it.todo('Should call findById with correct value');
  it.todo('Should throw if findById throws');

  it.todo('Should call Encrypter with correct value');
  it.todo('Should throw if Encrypter throws');
  it.todo('Should call add with correct values');
  it.todo('Should throw if add throws');
  it.todo('Should return an account and an accessToken on success');
});
