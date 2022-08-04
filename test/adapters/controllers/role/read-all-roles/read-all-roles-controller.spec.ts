import { ReadAllRolesUseCase } from '@/use-cases/role/read-all-roles';
import { ServerError } from '@/adapters/errors';
import { serverError } from '@/adapters/util/http';
import { makeReadAllRolesUseCase } from '@/test/stubs';
import { success } from '@/shared';
import { ReadAllRolesController } from '@/adapters/controllers/role/read-all-roles';

type SutTypes = {
  sut: ReadAllRolesController,
  useCase: ReadAllRolesUseCase,
};

const makeSut = (): SutTypes => {
  const useCase = makeReadAllRolesUseCase();
  const sut = new ReadAllRolesController(useCase);

  return {
    sut,
    useCase,
  };
};

describe('ReadAllRoles Controller ', () => {
  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle();
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, useCase } = makeSut();

    const useCaseReturn = [{
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }, {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }];
    jest.spyOn(useCase, 'execute').mockResolvedValue(useCaseReturn);
    const response = await sut.handle();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(useCaseReturn);
  });
});
