import { IRoleRepository } from '@/use-cases/roles/interfaces';
import { makeRoleRepository } from '@/test/stubs';
import { NonExistingRoleError } from '@/use-cases/roles/errors';
import { ReadRoleUseCase } from '@/use-cases/roles/read-role';

type SutTypes = {
  sut: ReadRoleUseCase,
  roleRepository: IRoleRepository,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const sut = new ReadRoleUseCase(roleRepository);
  return {
    sut,
    roleRepository,
  };
};

describe('ReadRoleUseCase', () => {
  it('Should return an error if role do not exists', async () => {
    const { sut } = makeSut();
    const response = await sut.execute('any_role');
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingRoleError());
  });

  it('Should return role data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = { id: 'any_id', role: 'any_role', createdAt: new Date() };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);

    const response = await sut.execute('any_role');
    expect(response.value).toEqual({
      id: findByIdReturn.id,
      role: findByIdReturn.role,
      createdAt: findByIdReturn.createdAt,
    });
  });
});
