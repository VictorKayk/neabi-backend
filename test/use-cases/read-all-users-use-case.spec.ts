import { IUserRepository } from '@/use-cases/interfaces';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository } from '@/test/stubs';
import { ReadAllUsersUseCase } from '@/use-cases/read-all-users';

type SutTypes = {
  userRepository: IUserRepository,
  sut: ReadAllUsersUseCase,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const sut = new ReadAllUsersUseCase(userRepository);
  const user = new UserBuilder();

  return {
    userRepository,
    sut,
    user,
  };
};

describe('ReadAllUsersUseCase', () => {
  it('Should return user data on success', async () => {
    const { sut, user, userRepository } = makeSut();

    const userRepositoryReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(userRepository, 'readAllUsers').mockResolvedValue([userRepositoryReturn, userRepositoryReturn]);
    const response = await sut.execute();

    expect(response).toEqual([{
      id: userRepositoryReturn.id,
      name: userRepositoryReturn.name,
      email: userRepositoryReturn.email,
      accessToken: userRepositoryReturn.accessToken,
      createdAt: userRepositoryReturn.createdAt,
      updatedAt: userRepositoryReturn.updatedAt,
    },
    {
      id: userRepositoryReturn.id,
      name: userRepositoryReturn.name,
      email: userRepositoryReturn.email,
      accessToken: userRepositoryReturn.accessToken,
      createdAt: userRepositoryReturn.createdAt,
      updatedAt: userRepositoryReturn.updatedAt,
    }]);
  });

  it('Should throw if readAllUsers throws', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'readAllUsers').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute();
    await expect(promise).rejects.toThrow();
  });
});
