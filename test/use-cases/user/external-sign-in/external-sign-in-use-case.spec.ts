import { User } from '@/entities/user';
import { InvalidNameError, InvalidEmailError } from '@/entities/value-object/errors';
import {
  IUserRepository,
  IEncrypter,
  IUserRepositoryReturnData,
} from '@/use-cases/user/interfaces';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { UserBuilder } from '@/test/builders/user-builder';
import {
  makeUserRepository,
  makeEncrypter,
  makeUniversallyUniqueIdentifierGenerator,
} from '@/test/stubs/';

type SutTypes = {
  userRepository: IUserRepository,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  encrypter: IEncrypter,
  sut: ExternalSignInUseCase,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const encrypter = makeEncrypter();
  const sut = new ExternalSignInUseCase(userRepository, idGenerator, encrypter);
  const user = new UserBuilder();
  return {
    userRepository,
    encrypter,
    idGenerator,
    sut,
    user,
  };
};

describe('External Sign In Use Case', () => {
  it('Should call user entity with correct values', async () => {
    const { sut, user } = makeSut();
    const userSpy = jest.spyOn(User, 'create');
    await sut.execute({ name: user.build().name, email: user.build().email, isVerified: true });
    expect(userSpy)
      .toHaveBeenCalledWith({ name: user.build().name, email: user.build().email });
  });

  it('Should return an error if name is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute({ name: '', email: user.build().email, isVerified: true });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidNameError(''));
  });

  it('Should return an error if email is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute({ name: user.build().name, email: '', isVerified: true });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });

  it('Should call findByEmail with correct email', async () => {
    const { sut, user, userRepository } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'findByEmail');
    await sut.execute({ name: user.build().name, email: user.build().email, isVerified: true });
    expect(userRepositorySpy).toHaveBeenCalledWith(user.build().email);
  });

  it('Should throw if findByEmail throws', async () => {
    const { sut, userRepository, user } = makeSut();
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    await expect(promise).rejects.toThrow();
  });

  it('Should call updateByEmail with correct values if user already exists', async () => {
    const {
      sut, user, userRepository, encrypter,
    } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    })));
    const userRepositorySpy = jest.spyOn(userRepository, 'updateByEmail');

    const response = await (await sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    )).value as IUserRepositoryReturnData;
    expect(userRepositorySpy).toHaveBeenCalledWith(user.build().email, {
      accessToken: await encrypter.encrypt(response.id),
    });
  });

  it('Should throw if updateByEmail throws if user already exists', async () => {
    const { sut, user, userRepository } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    })));
    jest.spyOn(userRepository, 'updateByEmail').mockRejectedValue(new Error());

    const promise = sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    await expect(promise).rejects.toThrow();
  });

  it('Should return an user and an accessToken if user already exists', async () => {
    const {
      sut,
      user,
      idGenerator,
      encrypter,
      userRepository,
    } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    })));

    const response = await sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    const value = response.value as IUserRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      ...user.build(),
      id: await idGenerator.generate(),
      isDeleted: false,
      isVerified: false,
      roles: [],
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    });
  });

  it('Should throw if IdGenerator throws', async () => {
    const { sut, user, idGenerator } = makeSut();
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    await expect(promise).rejects.toThrow();
  });

  it('Should call findById with correct value', async () => {
    const {
      sut,
      user,
      userRepository,
      idGenerator,
    } = makeSut();

    const userRepositorySpy = jest.spyOn(userRepository, 'findById');

    await sut.execute({ name: user.build().name, email: user.build().email, isVerified: true });
    expect(userRepositorySpy).toHaveBeenCalledWith(await idGenerator.generate());
  });

  it('Should throw if findById throws', async () => {
    const { sut, user, userRepository } = makeSut();
    jest.spyOn(userRepository, 'findById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    await expect(promise).rejects.toThrow();
  });

  it('Should call Encrypter with correct value', async () => {
    const {
      sut,
      user,
      idGenerator,
      encrypter,
    } = makeSut();
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');
    await sut.execute({ name: user.build().name, email: user.build().email, isVerified: true });
    expect(encrypterSpy).toHaveBeenCalledWith(await idGenerator.generate());
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, user, encrypter } = makeSut();
    jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const {
      sut,
      user,
      userRepository,
      idGenerator,
      encrypter,
    } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'add');
    await sut.execute({ name: user.build().name, email: user.build().email, isVerified: true });
    expect(userRepositorySpy).toHaveBeenCalledWith({
      id: await idGenerator.generate(),
      name: user.build().name,
      email: user.build().email,
      isVerified: true,
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
    });
  });

  it('Should throw if add throws', async () => {
    const { sut, user, userRepository } = makeSut();
    jest.spyOn(userRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    await expect(promise).rejects.toThrow();
  });

  it('Should return an user and an accessToken on add user success', async () => {
    const {
      sut,
      user,
      idGenerator,
      encrypter,
    } = makeSut();
    const response = await sut.execute(
      { name: user.build().name, email: user.build().email, isVerified: true },
    );
    const value = response.value as IUserRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      id: await idGenerator.generate(),
      name: user.build().name,
      email: user.build().email,
      isDeleted: false,
      isVerified: false,
      roles: [],
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    });
  });
});
