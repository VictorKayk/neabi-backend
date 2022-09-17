import { makeUserHasRoleRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';
import { IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';

type SutTypes = {
  sut: ReadAllRolesFromUserUseCase,
  userHasRoleRepository: IUserHasRoleRepository,
};

const makeSut = (): SutTypes => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  const sut = new ReadAllRolesFromUserUseCase(userHasRoleRepository);

  jest.spyOn(userHasRoleRepository, 'findUserById').mockResolvedValue({
    id: 'any_role',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_token',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [{
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }],
  });
  jest.spyOn(userHasRoleRepository, 'findRoleById').mockResolvedValue({
    id: 'any_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(), isDeleted: false,
  });

  return {
    sut,
    userHasRoleRepository,
  };
};

describe('ReadAllRolesFromUserUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const userHasRoleRepositorySpy = jest.spyOn(userHasRoleRepository, 'findUserById');
    await sut.execute({ userId: 'any_userId', roleDataQuery: {} });
    expect(userHasRoleRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', roleDataQuery: {} });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', roleDataQuery: {} });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should call readAllRolesFromUser with correct value', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const userHasRoleRepositorySpy = jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser');
    await sut.execute({ userId: 'any_userId', roleDataQuery: { } });
    expect(userHasRoleRepositorySpy).toHaveBeenCalledWith('any_userId', { });
  });

  it('Should return all user roles', async () => {
    const { sut, userHasRoleRepository } = makeSut();

    const rolesReturn = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser').mockResolvedValue([rolesReturn, rolesReturn]);

    const response = await sut.execute({ userId: 'any_userId', roleDataQuery: {} });
    expect(response.isSuccess()).toBe(true);
    expect(response.value).toEqual([rolesReturn, rolesReturn]);
  });

  it('Should throw if readAllRolesFromUser throws', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'readAllRolesFromUser').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', roleDataQuery: {} });
    await expect(promise).rejects.toThrow();
  });
});
