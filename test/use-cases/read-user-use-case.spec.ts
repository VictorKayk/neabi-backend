import { ReadUserUseCase } from '@/use-cases/read-user';
import { IUserRepository, IUserRepositoryData } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository } from '@/test/stubs';

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

describe('ReadUserUseCase Use Case', () => {
  it('Should return an error if user do not exists', async () => {
    const { sut, user } = makeSut();
    const response = await sut.execute(user.build().id);

    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingUserError());
  });

  it('Should return user data on success', async () => {
    const { sut, userRepository, user } = makeSut();

    jest.spyOn(userRepository, 'findById').mockResolvedValue(user.build());

    const response = await sut.execute(user.build().id);
    const value = response.value as IUserRepositoryData;

    expect(value).toEqual(user.build());
  });
});
