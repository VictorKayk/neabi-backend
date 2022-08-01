import { IRoleRepository } from '@/use-cases/role/interfaces';
import { makeRoleRepository } from '@/test/stubs';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { DeleteRoleByIdUseCase } from '@/use-cases/role/delete-role-by-id';

type SutTypes = {
  sut: DeleteRoleByIdUseCase,
  roleRepository: IRoleRepository,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const sut = new DeleteRoleByIdUseCase(roleRepository);
  return {
    sut,
    roleRepository,
  };
};

describe('DeleteRoleByIdUseCase', () => {
  it('Should call deleteById with correct values', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = { id: 'any_id', role: 'any_role', createdAt: new Date() };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);
    const deleteSpy = jest.spyOn(roleRepository, 'deleteById');

    await sut.execute('any_id');
    expect(deleteSpy).toHaveBeenCalledWith('any_id');
  });

  it('Should return user data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = { id: 'any_id', role: 'any_role', createdAt: new Date() };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);
    jest.spyOn(roleRepository, 'deleteById').mockResolvedValue(findByIdReturn);

    const response = await sut.execute('any_id');
    expect(response.isSuccess()).toBe(true);
    expect(response.value).toEqual(findByIdReturn);
  });

  it('Should return an error if role do not exists', async () => {
    const { sut } = makeSut();
    const response = await sut.execute('any_role');
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingRoleError());
  });
});
