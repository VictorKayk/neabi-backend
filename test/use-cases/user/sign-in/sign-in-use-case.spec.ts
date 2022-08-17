import { User } from '@/entities/user';
import { InvalidEmailError, InvalidPasswordError } from '@/entities/value-object/errors';
import { SignInUseCase } from '@/use-cases/user/sign-in';
import { IUserRepository, IEncrypter, IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { InvalidEmailOrPasswordError } from '@/use-cases/user/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import {
  makeUserRepository,
  makeEncrypter,
  makeHashCompare,
} from '@/test/stubs';
import { IHashCompare } from '@/use-cases/interfaces';

type SutTypes = {
  userRepository: IUserRepository,
  hashCompare: IHashCompare,
  encrypter: IEncrypter,
  sut: SignInUseCase,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const hashCompare = makeHashCompare();
  const encrypter = makeEncrypter();
  const sut = new SignInUseCase(userRepository, hashCompare, encrypter);
  const user = new UserBuilder();

  jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
    ...user.build(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  });

  return {
    userRepository,
    hashCompare,
    encrypter,
    sut,
    user,
  };
};

describe('SignInUseCase', () => {
  it('Should call user entity with correct values', async () => {
    const { sut, user } = makeSut();
    const userSpy = jest.spyOn(User, 'create');
    await sut.execute(user.build());
    expect(userSpy)
      .toHaveBeenCalledWith({
        email: user.build().email,
        password: user.build().password,
      });
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
    jest.spyOn(userRepository, 'findByEmail').mockRejectedValue(new Error());
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user do not exists', async () => {
    const { sut, userRepository, user } = makeSut();
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const error = await sut.execute(user.build());
    expect(error.isError()).toBe(true);
    expect(error.value)
      .toEqual(new InvalidEmailOrPasswordError(user.build().email, user.build().password));
  });

  it('Should call HashCompare with correct password', async () => {
    const { sut, user, hashCompare } = makeSut();
    const hashCompareSpy = jest.spyOn(hashCompare, 'compare');
    await sut.execute(user.build());
    expect(hashCompareSpy).toHaveBeenCalledWith(user.build().password, user.build().password);
  });

  it('Should throw if HashCompare throws', async () => {
    const { sut, user, hashCompare } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockRejectedValue(new Error());
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if HashCompare fails', async () => {
    const { sut, user, hashCompare } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const error = await sut.execute(user.build());
    expect(error.value)
      .toEqual(new InvalidEmailOrPasswordError(user.build().email, user.build().password));
  });

  it('Should call Encrypter with correct value', async () => {
    const { sut, user, encrypter } = makeSut();
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt');
    const response = await (await sut.execute(user.build())).value as IUserRepositoryReturnData;
    expect(encrypterSpy).toHaveBeenCalledWith(response.id);
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, user, encrypter } = makeSut();
    jest.spyOn(encrypter, 'encrypt').mockRejectedValue(new Error());
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should call updateByEmail with correct values', async () => {
    const {
      sut, user, userRepository, encrypter,
    } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'updateByEmail');
    const response = await (await sut.execute(user.build())).value as IUserRepositoryReturnData;
    expect(userRepositorySpy).toHaveBeenCalledWith(user.build().email, {
      accessToken: await encrypter.encrypt(response.id),
    });
  });

  it('Should throw if updateByEmail throws', async () => {
    const { sut, user, userRepository } = makeSut();
    jest.spyOn(userRepository, 'updateByEmail').mockRejectedValue(new Error());
    const promise = sut.execute(user.build());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an user and an accessToken on success', async () => {
    const { sut, user, encrypter } = makeSut();
    const response = await (await sut.execute(user.build())).value as IUserRepositoryReturnData;
    expect(response.name).toBe(user.build().name);
    expect(response.email).toBe(user.build().email);
    expect(response.accessToken).toBe(await encrypter.encrypt(response.id));
  });
});
