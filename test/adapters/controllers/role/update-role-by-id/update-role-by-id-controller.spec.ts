import { UpdateRoleByIdUseCase } from '@/use-cases/role/update-role-by-id';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { ServerError } from '@/adapters/errors';
import { badRequest, serverError, unauthorized } from '@/adapters/util/http';
import { makeUpdateRoleByIdUseCase, makeFakeRequestAuthenticated, makeValidation } from '@/test/stubs';
import { error, success } from '@/shared';
import { InvalidRoleError } from '@/entities/value-object/errors';
import { UpdateRoleByIdController } from '@/adapters/controllers/role/update-role-by-id';
import { IValidation } from '@/adapters/controllers/interfaces';
import { MissingParamsError } from '@/adapters/controllers/errors';

type SutTypes = {
  sut: UpdateRoleByIdController,
  validation: IValidation,
  useCase: UpdateRoleByIdUseCase,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeUpdateRoleByIdUseCase();
  const sut = new UpdateRoleByIdController(validation, useCase);

  return {
    sut,
    validation,
    useCase,
  };
};

describe('UpdateRoleById Controller', () => {
  it('Should call UpdateRoleByIdUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: 'any_role' },
      params: { id: 'any_id' },
    });
    expect(useCaseSpy).toHaveBeenCalledWith({ id: 'any_id', role: 'any_role' });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: 'any_role' },
      params: { id: 'any_id' },
    });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, useCase } = makeSut();

    const useCaseReturn = {
      id: 'any_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
    };
    jest.spyOn(useCase, 'execute').mockResolvedValue(success(useCaseReturn));
    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: 'any_role' },
      params: { id: 'any_id' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(useCaseReturn);
  });

  it('Should return 400 if role do not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new NonExistingRoleError()));

    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: 'any_role' },
      params: { id: 'invalid_id' },
    });
    expect(response).toEqual(badRequest(new NonExistingRoleError()));
  });

  it('Should return 400 if call UpdateRoleUseCase with incorrect values', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: '' },
      params: { id: 'any_id' },
    });
    expect(response).toEqual(badRequest(new InvalidRoleError('')));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: 'any_role' },
      params: { id: 'invalid_id' },
    });
    expect(validationSpy).toHaveBeenCalledWith({ id: 'invalid_id', role: 'any_role' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({
      ...makeFakeRequestAuthenticated(),
      body: { role: 'any_role' },
      params: { id: 'invalid_id' },
    });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
