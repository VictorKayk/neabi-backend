import { IUserRepository } from '@/use-cases/user/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository } from '@/test/stubs';
import { DeleteUserUseCase } from '@/use-cases/user/delete-user';

type SutTypes = {
  userRepository: IUserRepository,
  sut: DeleteUserUseCase,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const sut = new DeleteUserUseCase(userRepository);
  const user = new UserBuilder();

  return {
    userRepository,
    sut,
    user,
  };
};

describe('DeleteUserUseCase', () => {
  it('Should return an error if user do not exists', async () => {
    const { sut, user } = makeSut();
    const response = await sut.execute(user.build().id);
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingUserError());
  });

  it('Should call deleteById with correct values', async () => {
    const { sut, userRepository, user } = makeSut();

    const findByIdReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      roles: [],
    };
    jest.spyOn(userRepository, 'findById').mockResolvedValue(findByIdReturn);

    const deleteSpy = jest.spyOn(userRepository, 'deleteById');
    await sut.execute(user.build().id);
    expect(deleteSpy).toHaveBeenCalledWith(user.build().id);
  });

  it('Should return user data on success', async () => {
    const { sut, userRepository, user } = makeSut();

    const findByIdReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      roles: [],
    };
    jest.spyOn(userRepository, 'findById').mockResolvedValue(findByIdReturn);
    jest.spyOn(userRepository, 'deleteById').mockResolvedValue(findByIdReturn);

    const response = await sut.execute(user.build().id);
    expect(response.value).toEqual(findByIdReturn);
  });
});
