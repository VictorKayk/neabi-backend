import { User } from '@/entities/user';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/value-object/errors';
import { IUserRepository, IUserRepositoryReturnData, IHasher } from '@/use-cases/user/interfaces';
import { ExistingUserError, NonExistingUserError } from '@/use-cases/user/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository, makeHasher } from '@/test/stubs';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';

type SutTypes = {
  userRepository: IUserRepository,
  hasher: IHasher
  sut: UpdateUserUseCase,
  user: UserBuilder,
  repositoryReturn: IUserRepositoryReturnData,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const hasher = makeHasher();
  const sut = new UpdateUserUseCase(userRepository, hasher);
  const user = new UserBuilder();

  const repositoryReturn = {
    ...user.build(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    roles: [],
  };

  jest.spyOn(userRepository, 'findById').mockResolvedValue(repositoryReturn);
  jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(repositoryReturn);

  return {
    userRepository,
    hasher,
    sut,
    user,
    repositoryReturn,
  };
};

describe('UpdateUserUseCase', () => {
  it('Should call user entity with correct values', async () => {
    const { sut, user } = makeSut();

    const userSpy = jest.spyOn(User, 'create');

    await sut.execute({ id: user.build().id, userData: user.build() });
    expect(userSpy)
      .toHaveBeenCalledWith({
        name: user.build().name,
        email: user.build().email,
        password: user.build().password,
      });
  });

  it('Should return an error if name is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute({
      id: user.build().id,
      userData: {
        name: '',
      },
    });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidNameError(''));
  });

  it('Should return an error if email is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute({
      id: user.build().id,
      userData: {
        email: '',
      },
    });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });

  it('Should return an error if password is invalid', async () => {
    const { sut, user } = makeSut();
    const error = await sut.execute({
      id: user.build().id,
      userData: {
        password: '',
      },
    });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidPasswordError(''));
  });

  it('Should return an error if user do not exists', async () => {
    const { sut, user, userRepository } = makeSut();
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
    const response = await sut.execute({ id: user.build().id, userData: {} });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingUserError());
  });

  it('Should update name', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'updateById').mockResolvedValue({ ...repositoryReturn, name: 'new_name' });

    const response = await sut.execute({ id: user.build().id, userData: { name: 'new_name' } });
    expect(response.value)
      .toEqual({ ...repositoryReturn, name: 'new_name' });
  });

  it('Should update email', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue({ ...repositoryReturn, email: 'new_email@test.com' });

    const response = await sut.execute({ id: user.build().id, userData: { email: 'new_email@test.com' } });
    expect(response.value)
      .toEqual({ ...repositoryReturn, email: 'new_email@test.com' });
  });

  it('Should update email if it is the same email as the user', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(repositoryReturn);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue(repositoryReturn);

    const response = await sut.execute({
      id: user.build().id,
      userData: { email: repositoryReturn.email },
    });
    expect(response.value).toEqual(repositoryReturn);
  });

  it('Should return an error if email is already taken by any other user', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({ ...repositoryReturn, id: 'another_id' });

    const response = await sut.execute({ id: user.build().id, userData: { email: 'invalid_email@test.com' } });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new ExistingUserError());
  });

  it('Should return an error if user password is null, and he is trying to update', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'findById').mockResolvedValue({ ...repositoryReturn, password: null });
    jest.spyOn(userRepository, 'updateById').mockResolvedValue({ ...repositoryReturn, password: null });

    const response = await sut.execute({ id: user.build().id, userData: { password: 'new_password_1' } });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new InvalidPasswordError('new_password_1'));
  });

  it('Should call hasher with correct values', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
      hasher,
    } = makeSut();

    jest.spyOn(userRepository, 'updateById').mockResolvedValue({ ...repositoryReturn, password: 'new_password_1' });

    const hasherSpy = jest.spyOn(hasher, 'hash');
    await sut.execute({ id: user.build().id, userData: { password: 'new_password_1' } });
    expect(hasherSpy).toHaveBeenCalledWith('new_password_1');
  });

  it('Should update name, email and password', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'updateById').mockResolvedValue({
      ...repositoryReturn,
      name: 'new_name',
      email: 'new_email@test.com',
      password: 'new_password_1',
    });

    const response = await sut.execute({
      id: user.build().id,
      userData: {
        name: 'new_name',
        email: 'new_email@test.com',
        password: 'new_password_1',
      },
    });
    const value = response.value as IUserRepositoryReturnData;
    expect(value).toEqual({
      ...user.build(),
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      isDeleted: false,
      roles: [],
      password: 'new_password_1',
      name: 'new_name',
      email: 'new_email@test.com',
    });
  });

  it('Should throw if updateById throws', async () => {
    const { sut, user, userRepository } = makeSut();

    jest.spyOn(userRepository, 'updateById').mockRejectedValue(new Error());

    const promise = sut.execute({ id: user.build().id, userData: {} });
    await expect(promise).rejects.toThrow();
  });

  it('Should return user visible data on success', async () => {
    const {
      sut,
      user,
      userRepository,
      repositoryReturn,
    } = makeSut();

    jest.spyOn(userRepository, 'updateById').mockResolvedValue(repositoryReturn);

    const response = await sut.execute({ id: user.build().id, userData: {} });
    expect(response.value).toEqual(repositoryReturn);
  });
});
