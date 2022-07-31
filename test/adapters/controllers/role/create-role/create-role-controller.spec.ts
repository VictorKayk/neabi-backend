import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { IIdGenerator } from '@/use-cases/interfaces';
import { ExistingRoleError } from '@/use-cases/role/errors';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { InvalidRoleError } from '@/entities/value-object/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import { makeCreateRoleUseCase, makeIdGenerator, makeValidation } from '@/test/stubs';
import { error } from '@/shared';
import { CreateRoleController } from '@/adapters/controllers/role/create-role';

type SutTypes = {
  sut: CreateRoleController,
  validation: IValidation,
  useCase: CreateRoleUseCase,
  idGenerator: IIdGenerator,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeCreateRoleUseCase();
  const sut = new CreateRoleController(validation, useCase);
  const idGenerator = makeIdGenerator();

  return {
    sut,
    validation,
    useCase,
    idGenerator,
  };
};

describe('CreateRole Controller ', () => {
  it('Should call CreateRoleUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({ body: { role: 'any_role' } });
    expect(useCaseSpy).toHaveBeenCalledWith('any_role');
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ body: { role: 'any_role' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 201 on success', async () => {
    const { sut, idGenerator } = makeSut();
    const response = await sut.handle({ body: { role: 'any_role' } });
    expect(response).toEqual(created({
      id: await idGenerator.generate(),
      role: 'any_role',
      createdAt: response.body.createdAt,
    }));
  });

  it('Should return 400 if call CreateRoleUseCase with incorrect values', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { role: '' } });
    expect(response).toEqual(badRequest(new InvalidRoleError('')));
  });

  it('Should return 403 if role already exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new ExistingRoleError()),
    )));

    const response = await sut.handle({ body: { role: 'any_role' } });
    expect(response).toEqual(forbidden(new ExistingRoleError()));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ body: { role: 'any_role' } });
    expect(validationSpy).toHaveBeenCalledWith({ role: 'any_role' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ body: { role: 'any_role' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
