import { IUserRepository } from '@/use-cases/user/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository } from '@/test/stubs';
import { ReadUserUseCase } from '@/use-cases/user/read-user';

type SutTypes = {
  userRepository: IUserRepository,
  sut: ReadUserUseCase,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const sut = new ReadUserUseCase(userRepository);
  const user = new UserBuilder();

  return {
    userRepository,
    sut,
    user,
  };
};

describe('ReadUserUseCase', () => {
  it('Should return an error if user do not exists', async () => {
    const { sut, user } = makeSut();
    const response = await sut.execute(user.build().id);
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingUserError());
  });

  it('Should return user data on success', async () => {
    const { sut, userRepository, user } = makeSut();

    const findByIdReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(userRepository, 'findById').mockResolvedValue(findByIdReturn);

    const response = await sut.execute(user.build().id);
    expect(response.value).toEqual({
      id: findByIdReturn.id,
      name: findByIdReturn.name,
      email: findByIdReturn.email,
      accessToken: findByIdReturn.accessToken,
      createdAt: findByIdReturn.createdAt,
      updatedAt: findByIdReturn.updatedAt,
    });
  });
});
