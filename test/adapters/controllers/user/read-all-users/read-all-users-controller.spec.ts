import { getUserCriticalData } from '@/adapters/controllers/user/utils';
import { makeUserRepository } from '@/test/stubs';
import { ReadAllUsersUseCase } from '@/use-cases/user/read-all-users';
import { ServerError } from '@/adapters/errors';
import { serverError } from '@/adapters/util/http';
import { UserBuilder } from '@/test/builders/user-builder';
import { ReadAllUsersController } from '@/adapters/controllers/user/read-all-users';

type SutTypes = {
  sut: ReadAllUsersController,
  useCase: ReadAllUsersUseCase,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const repository = makeUserRepository();
  const useCase = new ReadAllUsersUseCase(repository);
  const sut = new ReadAllUsersController(useCase);
  const user = new UserBuilder();

  return {
    sut,
    useCase,
    user,
  };
};

describe('ReadUser Controller ', () => {
  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle({});
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, user, useCase } = makeSut();

    const useCaseReturn = [{
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    },
    {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }];

    jest.spyOn(useCase, 'execute').mockResolvedValue(useCaseReturn);

    const response = await sut.handle({});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(useCaseReturn.map((account) => getUserCriticalData(account)));
  });
});
