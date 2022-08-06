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
  it('Should return roles data on success', async () => {
    const { sut, roleRepository } = makeSut();

    const readAllUsersReturn = [
      {
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
      {
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    ];
    jest.spyOn(roleRepository, 'readAllRoles').mockResolvedValue(readAllUsersReturn);

    const response = await sut.execute({});
    expect(response).toEqual(readAllUsersReturn);
  });

  it('Should throw if readAllRoles throws', async () => {
    const { sut, roleRepository } = makeSut();
    jest.spyOn(roleRepository, 'readAllRoles').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({});
    await expect(promise).rejects.toThrow();
  });
});
