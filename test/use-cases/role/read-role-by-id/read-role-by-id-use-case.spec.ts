import { IRoleRepository } from '@/use-cases/role/interfaces';
import { makeRoleRepository } from '@/test/stubs';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { ReadRoleByIdUseCase } from '@/use-cases/role/read-role-by-id';

type SutTypes = {
  sut: ReadRoleByIdUseCase,
  roleRepository: IRoleRepository,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const sut = new ReadRoleByIdUseCase(roleRepository);
  return {
    sut,
    roleRepository,
  };
};

describe('ReadRoleByIdUseCase', () => {
  it('Should return an error if role do not exists', async () => {
    const { sut } = makeSut();
    const response = await sut.execute('any_role');
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingRoleError());
  });

  it('Should return role data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);

    const response = await sut.execute('any_role');
    expect(response.value).toEqual({
      id: findByIdReturn.id,
      role: findByIdReturn.role,
      createdAt: findByIdReturn.createdAt,
      updatedAt: findByIdReturn.updatedAt,
      isDeleted: findByIdReturn.isDeleted,
    });
  });
});
