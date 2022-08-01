import { ReadRoleByIdUseCase } from '@/use-cases/role/read-role-by-id';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { ServerError } from '@/adapters/errors';
import { serverError, unauthorized } from '@/adapters/util/http';
import { makeFakeRequestAuthenticated, makeReadRoleByIdUseCase } from '@/test/stubs';
import { error, success } from '@/shared';
import { ReadRoleByIdController } from '@/adapters/controllers/role/read-role-by-id';

type SutTypes = {
  sut: ReadRoleByIdController,
  useCase: ReadRoleByIdUseCase,
};

const makeSut = (): SutTypes => {
  const useCase = makeReadRoleByIdUseCase();
  const sut = new ReadRoleByIdController(useCase);

  return {
    sut,
    useCase,
  };
};

describe('ReadRoleById Controller ', () => {
  it('Should call ReadRoleByIdUseCase with correct values', async () => {
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

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

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
      id: 'invalid_id',
      params: { id: 'any_id' },
    });

    expect(response).toEqual(unauthorized(new NonExistingRoleError()));
  });
});
