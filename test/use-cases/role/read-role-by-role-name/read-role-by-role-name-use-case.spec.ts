import { IRoleRepository } from '@/use-cases/role/interfaces';
import { makeRoleRepository } from '@/test/stubs';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';

type SutTypes = {
  sut: ReadRoleByRoleNameUseCase,
  roleRepository: IRoleRepository,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const sut = new ReadRoleByRoleNameUseCase(roleRepository);
  return {
    sut,
    roleRepository,
  };
};

describe('ReadRoleByRoleNameUseCase', () => {
  it('Should return an error if role do not exists', async () => {
    const { sut } = makeSut();
    const response = await sut.execute('any_role');
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingRoleError());
  });

  it('Should return role data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const findByRoleReturn = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(roleRepository, 'findByRole').mockResolvedValue(findByRoleReturn);

    const response = await sut.execute('any_role');
    expect(response.value).toEqual({
      id: findByRoleReturn.id,
      role: findByRoleReturn.role,
      createdAt: findByRoleReturn.createdAt,
      updatedAt: findByRoleReturn.updatedAt,
      isDeleted: findByRoleReturn.isDeleted,
    });
  });
});
