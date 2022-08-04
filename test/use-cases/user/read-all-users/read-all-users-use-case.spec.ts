import { IUserRepository } from '@/use-cases/user/interfaces';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository } from '@/test/stubs';
import { getUserVisibleData } from '@/use-cases/user/util';
import { ReadAllUsersUseCase } from '@/use-cases/user/read-all-users';

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

    const readAllUsersReturn = [
      {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
      {
        ...user.build(), createdAt: new Date(), updatedAt: new Date(), isDeleted: false,
      },
    ];
    jest.spyOn(userRepository, 'readAllUsers').mockResolvedValue(readAllUsersReturn);

    const response = await sut.execute();
    const readAllUsersVisibleDataReturn = readAllUsersReturn
      .map((userData) => getUserVisibleData(userData));
    expect(response).toEqual(readAllUsersVisibleDataReturn);
  });

  it('Should throw if readAllUsers throws', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'readAllUsers').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute();
    await expect(promise).rejects.toThrow();
  });
});
