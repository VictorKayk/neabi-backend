import { DeleteRoleByIdUseCase } from '@/use-cases/role/delete-role-by-id';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { ServerError } from '@/adapters/errors';
import { badRequest, serverError, unauthorized } from '@/adapters/util/http';
import { makeDeleteRoleByIdUseCase, makeFakeRequestAuthenticated, makeValidation } from '@/test/stubs';
import { error, success } from '@/shared';
import { DeleteRoleByIdController } from '@/adapters/controllers/role/delete-role-by-id';
import { IValidation } from '@/adapters/controllers/interfaces';
import { MissingParamsError } from '@/adapters/controllers/errors/missing-params-error';

type SutTypes = {
  sut: DeleteRoleByIdController,
  validation: IValidation,
  useCase: DeleteRoleByIdUseCase,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeDeleteRoleByIdUseCase();
  const sut = new DeleteRoleByIdController(validation, useCase);

  return {
    sut,
    validation,
    useCase,
  };
};

describe('DeleteRoleById Controller ', () => {
  it('Should call DeleteRoleByIdUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: 'any_id' },
    });
    expect(useCaseSpy).toHaveBeenCalledWith('any_id');
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: 'any_id' },
    });
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
    jest.spyOn(useCase, 'execute').mockResolvedValue(success(useCaseReturn));
    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: 'any_id' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(useCaseReturn);
  });

  it('Should return 401 if role do not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new NonExistingRoleError()));

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      params: { id: 'invalid_id' },
    });
    expect(response).toEqual(unauthorized(new NonExistingRoleError()));
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
