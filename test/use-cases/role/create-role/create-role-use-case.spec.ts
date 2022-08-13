import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/role/interfaces';
import { makeUniversallyUniqueIdentifierGenerator, makeRoleRepository } from '@/test/stubs';
import { Role } from '@/entities/value-object';
import { InvalidRoleError } from '@/entities/value-object/errors';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { ExistingRoleError } from '@/use-cases/role/errors';

type SutTypes = {
  sut: CreateRoleUseCase,
  roleRepository: IRoleRepository,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const sut = new CreateRoleUseCase(roleRepository, idGenerator);
  return {
    sut,
    roleRepository,
    idGenerator,
  };
};

describe('CreateRoleUseCase', () => {
  it('Should call role value object with correct value', async () => {
    const { sut } = makeSut();
    const roleSpy = jest.spyOn(Role, 'create');
    await sut.execute('any_role');
    expect(roleSpy).toHaveBeenCalledWith('any_role');
  });

  it('Should return an error if role is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute('');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidRoleError(''));
  });

  it('Should call findByRole with correct role', async () => {
    const { sut, roleRepository } = makeSut();
    const roleRepositorySpy = jest.spyOn(roleRepository, 'findByRole');
    await sut.execute('any_role');
    expect(roleRepositorySpy).toHaveBeenCalledWith('any_role');
  });

  it('Should throw if findByRole throws', async () => {
    const { sut, roleRepository } = makeSut();
    jest.spyOn(roleRepository, 'findByRole').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_role');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if role already exists', async () => {
    const { sut, roleRepository } = makeSut();
    jest.spyOn(roleRepository, 'findByRole').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    })));
    const error = await sut.execute('any_role');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new ExistingRoleError());
  });

  it('Should return an role if role already exists and have been deleted', async () => {
    const { sut, roleRepository } = makeSut();

    jest.spyOn(roleRepository, 'findByRole').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
    })));
    jest.spyOn(roleRepository, 'updateById').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    })));

    const response = await sut.execute('any_role');
    const value = response.value as IRoleRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      id: 'any_id',
      role: 'any_role',
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      isDeleted: false,
    });
  });

  it('Should throw if IdGenerator throws', async () => {
    const { sut, idGenerator } = makeSut();
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_role');
    await expect(promise).rejects.toThrow();
  });

  it('Should call findById with correct value', async () => {
    const { sut, roleRepository, idGenerator } = makeSut();
    const roleRepositorySpy = jest.spyOn(roleRepository, 'findById');
    await sut.execute('any_role');
    expect(roleRepositorySpy).toHaveBeenCalledWith(await idGenerator.generate());
  });

  it('Should throw if findById throws', async () => {
    const { sut, roleRepository } = makeSut();
    jest.spyOn(roleRepository, 'findById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_role');
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const { sut, roleRepository, idGenerator } = makeSut();
    const roleRepositorySpy = jest.spyOn(roleRepository, 'add');
    await sut.execute('any_role');
    expect(roleRepositorySpy).toHaveBeenCalledWith({
      id: await idGenerator.generate(),
      role: 'any_role',
    });
  });

  it('Should throw if add throws', async () => {
    const { sut, roleRepository } = makeSut();
    jest.spyOn(roleRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_role');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an role on success', async () => {
    const { sut, idGenerator } = makeSut();
    const response = await sut.execute('any_role');
    const value = response.value as IRoleRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      id: await idGenerator.generate(),
      role: 'any_role',
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      isDeleted: value.isDeleted,
    });
  });
});
