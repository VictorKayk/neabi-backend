import { IRoleRepository } from '@/use-cases/role/interfaces';
import { makeRoleRepository } from '@/test/stubs';
import { ReadAllRolesUseCase } from '@/use-cases/role/read-all-roles';

type SutTypes = {
  sut: ReadAllRolesUseCase,
  roleRepository: IRoleRepository,
};

const makeSut = (): SutTypes => {
  const roleRepository = makeRoleRepository();
  const sut = new ReadAllRolesUseCase(roleRepository);
  return {
    sut,
    roleRepository,
  };
};

describe('ReadAllRolesUseCase', () => {
  it('Should call readAllRoles with correct values', async () => {
    const { sut, roleRepository } = makeSut();
    const roleRepositorySpy = jest.spyOn(roleRepository, 'readAllRoles');
    await sut.execute({ });
    expect(roleRepositorySpy).toHaveBeenCalledWith({ });
  });

  it('Should return roles data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const roleReturn = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(roleRepository, 'readAllRoles').mockResolvedValue([roleReturn, roleReturn]);

    const response = await sut.execute({});
    expect(response).toEqual([roleReturn, roleReturn]);
  });

  it('Should throw if readAllRoles throws', async () => {
    const { sut, roleRepository } = makeSut();
    jest.spyOn(roleRepository, 'readAllRoles').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({});
    await expect(promise).rejects.toThrow();
  });
});
