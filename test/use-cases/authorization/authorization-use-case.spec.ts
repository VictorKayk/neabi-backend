import { AuthorizationUseCase } from '@/use-cases/authorization';
import { IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';
import { makeUserHasRoleRepository } from '@/test/stubs';

type SutTypes = {
  userHasRoleRepository: IUserHasRoleRepository,
  sut: AuthorizationUseCase,
}

const makeSut = (): SutTypes => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  const sut = new AuthorizationUseCase(userHasRoleRepository);

  const rolesReturn = {
    id: 'any_id',
    role: 'any_role',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };
  jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser').mockResolvedValue([rolesReturn, rolesReturn]);

  return {
    userHasRoleRepository,
    sut,
  };
};

describe('Authorization Use Case', () => {
  it('Should call readAllRolesFromUser with correct values', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const readAllRolesFromUserSpy = jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser');
    await sut.execute({ userId: 'any_userId', allowedRoles: ['any_role'] });
    expect(readAllRolesFromUserSpy).toHaveBeenCalledWith('any_userId', {});
  });

  it('Should return an error if user does not have any role', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser').mockResolvedValue([]);
    const response = await sut.execute({ userId: 'any_userId', allowedRoles: ['any_role'] });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new UnauthorizedError());
  });

  it('Should return an error if user does not have any allowed role', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const rolesReturn = {
      id: 'any_id',
      role: 'invalid_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser').mockResolvedValue([rolesReturn, rolesReturn]);
    const response = await sut.execute({ userId: 'any_userId', allowedRoles: ['any_role'] });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new UnauthorizedError());
  });

  it('Should return null on success', async () => {
    const { sut } = makeSut();
    const response = await sut.execute({ userId: 'any_userId', allowedRoles: ['any_role'] });
    const { value } = response;
    expect(value).toBe(null);
  });
});
