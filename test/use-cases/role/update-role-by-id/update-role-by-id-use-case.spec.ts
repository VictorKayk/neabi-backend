import { Role } from '@/entities/value-object';
import { InvalidRoleError } from '@/entities/value-object/errors';
import { IRoleRepository } from '@/use-cases/role/interfaces';
import { makeRoleRepository } from '@/test/stubs';
import { ExistingRoleError, NonExistingRoleError } from '@/use-cases/role/errors';
import { UpdateRoleByIdUseCase } from '@/use-cases/role/update-role-by-id';

type SutTypes = {
  sut: UpdateRoleByIdUseCase,
  roleRepository: IRoleRepository,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const sut = new UpdateRoleByIdUseCase(roleRepository);
  return {
    sut,
    roleRepository,
  };
};

describe('UpdateRoleByIdUseCase', () => {
  it('Should call role value object with correct value', async () => {
    const { sut } = makeSut();
    const roleSpy = jest.spyOn(Role, 'create');
    await sut.execute({ id: 'any_id', role: 'any_role' });
    expect(roleSpy).toHaveBeenCalledWith('any_role');
  });

  it('Should return an error if role is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ id: 'any_id', role: '' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidRoleError(''));
  });

  it('Should return an error if role do not exists', async () => {
    const { sut } = makeSut();
    const response = await sut.execute({ id: 'invalid_id', role: 'any_role' });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new NonExistingRoleError());
  });

  it('Should update role if it is the same role as the user', async () => {
    const { sut, roleRepository } = makeSut();

    const repositoryReturn = {
      id: 'invalid_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
    };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(repositoryReturn);
    jest.spyOn(roleRepository, 'findByRole').mockResolvedValue(repositoryReturn);
    jest.spyOn(roleRepository, 'updateById').mockResolvedValue(repositoryReturn);

    const response = await sut.execute({ id: 'invalid_id', role: 'any_role' });
    expect(response.value).toEqual(repositoryReturn);
  });

  it('Should return an error if role is already taken by any other user', async () => {
    const { sut, roleRepository } = makeSut();

    const repositoryReturn = {
      id: 'invalid_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
    };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(repositoryReturn);
    jest.spyOn(roleRepository, 'findByRole').mockResolvedValue({ ...repositoryReturn, id: 'another_id' });

    const response = await sut.execute({ id: 'invalid_id', role: 'any_role' });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new ExistingRoleError());
  });

  it('Should call updateById with correct value', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = {
      id: 'any_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
    };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);
    const updateSpy = jest.spyOn(roleRepository, 'updateById');

    await sut.execute({ id: 'any_id', role: 'any_role' });
    expect(updateSpy).toHaveBeenCalledWith({ id: 'any_id', role: 'any_role' });
  });

  it('Should throw if updateById throws', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = {
      id: 'any_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
    };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);
    jest.spyOn(roleRepository, 'updateById').mockRejectedValue(new Error());

    const promise = sut.execute({ id: 'any_id', role: 'any_role' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return user data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const findByIdReturn = {
      id: 'any_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
    };
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(findByIdReturn);
    jest.spyOn(roleRepository, 'updateById').mockResolvedValue(findByIdReturn);

    const response = await sut.execute({ id: 'any_id', role: 'any_role' });
    expect(response.isSuccess()).toBe(true);
    expect(response.value).toEqual(findByIdReturn);
  });
});
