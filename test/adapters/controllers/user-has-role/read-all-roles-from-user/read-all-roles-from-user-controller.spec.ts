import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { makeReadAllRolesFromUserUseCase, makeFakeRequestAuthenticated, makeValidation } from '@/test/stubs';
import { error, success } from '@/shared';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { ReadAllRolesFromUserController } from '@/adapters/controllers/user-has-role/read-all-roles-from-user';

type SutTypes = {
  sut: ReadAllRolesFromUserController,
  validation: IValidation,
  useCase: ReadAllRolesFromUserUseCase,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeReadAllRolesFromUserUseCase();
  const sut = new ReadAllRolesFromUserController(validation, useCase);

  return {
    sut,
    validation,
    useCase,
  };
};

describe('ReadAllRolesFromUserController', () => {
  it('Should call ReadAllRolesFromUserUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId' }, query: { page: 1 } });
    expect(useCaseSpy).toHaveBeenCalledWith({ userId: 'any_userId', roleDataQuery: { page: 1 } });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, useCase } = makeSut();

    const useCaseReturn = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(useCase, 'execute').mockResolvedValue(success([useCaseReturn, useCaseReturn]));

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId' } });
    expect(response).toEqual(ok([useCaseReturn, useCaseReturn]));
  });

  it('Should return 403 if user does not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new NonExistingUserError()),
    )));

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId' } });
    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId' } });
    expect(validationSpy).toHaveBeenCalledWith({ userId: 'any_userId' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
