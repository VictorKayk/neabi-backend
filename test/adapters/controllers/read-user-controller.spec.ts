import { makeUserRepository } from '@/test/stubs';
import { ReadUserUseCase } from '@/use-cases/read-user';
import { NonExistingUserError } from '@/use-cases/errors';
import { ServerError } from '@/adapters/errors';
import { serverError, unauthorized } from '@/adapters/util/http';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { ReadUserController } from '@/adapters/controllers/read-user-controller';

type SutTypes = {
  sut: ReadUserController,
  useCase: ReadUserUseCase,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const repository = makeUserRepository();
  const useCase = new ReadUserUseCase(repository);
  const sut = new ReadUserController(useCase);
  const user = new UserBuilder();

  return {
    sut,
    useCase,
    user,
  };
};

describe('ReadUser Controller ', () => {
  it('Should call ReadUserUseCase with correct values', async () => {
    const { sut, useCase, user } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({
      id: user.build().id,
      accessToken: 'any_accessToken',
      body: {},
    });
    expect(useCaseSpy).toHaveBeenCalledWith(user.build().id);
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase, user } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({
      id: user.build().id,
      accessToken: 'any_accessToken',
      body: {},
    });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, user, useCase } = makeSut();

    const useCaseReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(useCase, 'execute').mockResolvedValue(success(useCaseReturn));
    const response = await sut.handle({
      id: user.build().id,
      accessToken: 'any_accessToken',
      body: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(useCaseReturn);
  });

  it('Should return 401 if user do not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new NonExistingUserError()));
    const response = await sut.handle({
      id: 'invalid_id',
      accessToken: 'any_accessToken',
      body: {},
    });

    expect(response).toEqual(unauthorized(new NonExistingUserError()));
  });
});
