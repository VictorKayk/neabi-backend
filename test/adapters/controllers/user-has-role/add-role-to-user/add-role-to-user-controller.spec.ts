import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { UserAlreadyHaveThisRoleError } from '@/use-cases/user-has-role/errors';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import { makeAddRoleToUserUseCase, makeFakeRequestAuthenticated, makeValidation } from '@/test/stubs';
import { error, success } from '@/shared';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { AddRoleToUserController } from '@/adapters/controllers/user-has-role/add-role-to-user';

type SutTypes = {
  sut: AddRoleToUserController,
  validation: IValidation,
  useCase: AddRoleToUserUseCase,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeAddRoleToUserUseCase();
  const sut = new AddRoleToUserController(validation, useCase);

  return {
    sut,
    validation,
    useCase,
  };
};

describe('AddRoleToUserController', () => {
  it('Should call AddRoleToUserUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_roleId' } });
    expect(useCaseSpy).toHaveBeenCalledWith({ userId: 'any_userId', roleId: 'any_roleId' });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_roleId' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 201 on success', async () => {
    const { sut, useCase } = makeSut();

    const useCaseReturn = {
      userId: 'any_userId',
      roleId: 'any_roleId',
      createdAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(useCase, 'execute').mockResolvedValue(success(useCaseReturn));

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_roleId' } });
    expect(response).toEqual(created(useCaseReturn));
  });

  it('Should return 403 if role does not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new NonExistingRoleError()),
    )));

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_roleId' } });
    expect(response).toEqual(forbidden(new NonExistingRoleError()));
  });

  it('Should return 403 if user does not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new NonExistingUserError()),
    )));

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_roleId' } });
    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should return 403 if user already has the role', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new UserAlreadyHaveThisRoleError()),
    )));

    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_roleId' } });
    expect(response).toEqual(forbidden(new UserAlreadyHaveThisRoleError()));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_role' } });
    expect(validationSpy).toHaveBeenCalledWith({ userId: 'any_userId', roleId: 'any_role' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ ...makeFakeRequestAuthenticated(), params: { userId: 'any_userId', roleId: 'any_role' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
