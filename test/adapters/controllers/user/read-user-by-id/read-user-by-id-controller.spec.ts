import { getUserCriticalData } from '@/adapters/controllers/user/utils';
import { makeFakeRequestAuthenticated, makeUserRepository, makeValidation } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { ServerError } from '@/adapters/errors';
import { badRequest, serverError, unauthorized } from '@/adapters/util/http';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { ReadUserByIdController } from '@/adapters/controllers/user/read-user-by-id';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { IValidation } from '@/adapters/controllers/interfaces';
import { MissingParamsError } from '@/adapters/controllers/errors/missing-params-error';

type SutTypes = {
  sut: ReadUserByIdController,
  validation: IValidation,
  useCase: ReadUserUseCase,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const repository = makeUserRepository();
  const useCase = new ReadUserUseCase(repository);
  const sut = new ReadUserByIdController(validation, useCase);
  const user = new UserBuilder();

  return {
    sut,
    validation,
    useCase,
    user,
  };
};

describe('ReadUserById Controller ', () => {
  it('Should call ReadUserUseCase with correct values', async () => {
    const { sut, useCase, user } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });
    expect(useCaseSpy).toHaveBeenCalledWith(user.build().id);
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
    const { sut, user, useCase } = makeSut();

    const useCaseReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    };
    jest.spyOn(useCase, 'execute').mockResolvedValue(success(useCaseReturn));

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: user.build().id },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(getUserCriticalData(useCaseReturn));
  });

  it('Should return 401 if user do not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new NonExistingUserError()));
    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: 'invalid_id' },
    });

    expect(response).toEqual(unauthorized(new NonExistingUserError()));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ ...makeFakeRequestAuthenticated(), params: { id: 'any_id' } });
    expect(validationSpy).toHaveBeenCalledWith({ id: 'any_id' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { id: 'any_id' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
