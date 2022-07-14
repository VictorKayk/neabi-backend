import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import { SignUp } from '@/use-cases/signup';
import {
  IUserRepository,
  IHasher,
  IIdGenerator,
  IEncrypter,
} from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import {
  makeUserRepository,
  makeEncrypter,
  makeHasher,
  makeIdGenerator,
} from '@/test/stubs/';

type SutTypes = {
  userRepository: IUserRepository,
  hasher: IHasher,
  idGenerator: IIdGenerator,
  encrypter: IEncrypter,
  sut: SignUp,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();
  const sut = new SignUp(userRepository, hasher, idGenerator, encrypter);
  const user = new UserBuilder();
  return {
    userRepository,
    hasher,
    encrypter,
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
      .toHaveBeenCalledWith({
        name: user.build().name,
        email: user.build().email,
        password: user.build().password,
      });
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

  it('Should call findById with correct value', async () => {
    const {
      sut, user, userRepository, idGenerator,
    } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'findById');
    await sut.execute(user.build());
    expect(userRepositorySpy).toHaveBeenCalledWith(await idGenerator.generate());
  });

  it('Should throw if findById throws', async () => {
    const { sut, user, userRepository } = makeSut();
    jest.spyOn(userRepository, 'findById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should call Encrypter with correct value', async () => {
    const {
      sut, user, idGenerator, encrypter,
    } = makeSut();
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');
    await sut.execute(user.build());
    expect(encrypterSpy).toHaveBeenCalledWith(await idGenerator.generate());
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, user, encrypter } = makeSut();
    jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const {
      sut, user, userRepository, hasher, idGenerator, encrypter,
    } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'add');
    await sut.execute(user.build());
    expect(userRepositorySpy).toHaveBeenCalledWith({
      id: await idGenerator.generate(),
      name: user.build().name,
      email: user.build().email,
      password: await hasher.hash(user.build().password),
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
    });
  });

  it('Should throw if add throws', async () => {
    const { sut, user, userRepository } = makeSut();
    jest.spyOn(userRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an user and an accessToken on success', async () => {
    const {
      sut, user, hasher, idGenerator, encrypter,
    } = makeSut();
    const response = await sut.execute(user.build());
    expect(response.isSuccess()).toBe(true);
    expect(response.value).toEqual({
      id: await idGenerator.generate(),
      name: user.build().name,
      email: user.build().email,
      password: await hasher.hash(user.build().password),
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
    });
  });
});
