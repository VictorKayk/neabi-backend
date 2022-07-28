import { InvalidEmailError } from '@/entities/value-object/errors';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { NonExistingUserError, ExistingUserError } from '@/use-cases/user/errors';
import { ServerError } from '@/adapters/errors';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import { makeUpdateUserUseCase, makeFakeRequestAuthenticated } from '@/test/stubs';
import { error, success } from '@/shared';
import { UserBuilder } from '@/test/builders/user-builder';
import { UpdateUserByIdController } from '@/adapters/controllers/user/update-user-by-id-controller';

type SutTypes = {
  sut: UpdateUserByIdController,
  useCase: UpdateUserUseCase,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const useCase = makeUpdateUserUseCase();
  const sut = new UpdateUserByIdController(useCase);
  const user = new UserBuilder();

  return {
    sut,
    useCase,
    user,
  };
};

describe('UpdateUserById Controller ', () => {
  it('Should call UpdateUserUseCase with correct values', async () => {
    const { sut, useCase, user } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });
    expect(useCaseSpy).toHaveBeenCalledWith({
      id: 'any_id',
      userData: { ...makeFakeRequestAuthenticated().body },
    });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase, user } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, useCase, user } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: makeFakeRequestAuthenticated().body.name,
      email: makeFakeRequestAuthenticated().body.email,
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });
    expect(response).toEqual(ok({
      id: 'any_id',
      name: makeFakeRequestAuthenticated().body.name,
      email: makeFakeRequestAuthenticated().body.email,
      accessToken: response.body.accessToken,
      createdAt: response.body.createdAt,
      updatedAt: response.body.updatedAt,
    }));
  });

  it('Should return 400 if call UpdateUserUseCase with incorrect values', async () => {
    const { sut, user } = makeSut();
    const response = await sut.handle({
      id: 'any_id',
      accessToken: 'any_accessToken',
      body: {
        ...makeFakeRequestAuthenticated().body,
        email: '',
      },
      params: { id: user.build().id },
    });
    expect(response).toEqual(badRequest(new InvalidEmailError('')));
  });

  it('Should return 403 if user do not exists', async () => {
    const { sut, useCase, user } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new NonExistingUserError()),
    )));

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });
    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should return 403 if user already exists', async () => {
    const { sut, useCase, user } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new ExistingUserError()),
    )));

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });
    expect(response).toEqual(forbidden(new ExistingUserError()));
  });
});
