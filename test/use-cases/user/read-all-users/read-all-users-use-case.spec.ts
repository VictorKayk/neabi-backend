import { IUserRepository } from '@/use-cases/user/interfaces';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository } from '@/test/stubs';
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
  it('Should call readAllUsers with correct values', async () => {
    const { sut, userRepository } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'readAllUsers');
    await sut.execute({ page: 1 });
    expect(userRepositorySpy).toHaveBeenCalledWith({ page: 1 });
  });

  it('Should return users data on success', async () => {
    const { sut, user, userRepository } = makeSut();

    const userReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      roles: [],
    };
    jest.spyOn(userRepository, 'readAllUsers').mockResolvedValue([userReturn, userReturn]);

    const response = await sut.execute({});
    expect(response).toEqual([userReturn, userReturn]);
  });

  it('Should throw if readAllUsers throws', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'readAllUsers').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({});
    await expect(promise).rejects.toThrow();
  });
});
