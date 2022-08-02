import { makeUserHasRoleRepository } from '@/test/stubs';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { UserAlreadyHaveThisRoleError } from '@/use-cases/user-has-role/errors';
import { IUserHasRoleRepositoryReturnData, IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';

type SutTypes = {
  sut: AddRoleToUserUseCase,
  userHasRoleRepository: IUserHasRoleRepository,
};

const makeSut = (): SutTypes => {
  const userHasRoleRepository = makeUserHasRoleRepository();
  const sut = new AddRoleToUserUseCase(userHasRoleRepository);

  jest.spyOn(userHasRoleRepository, 'findUserById').mockResolvedValue({
    id: 'any_role', name: 'any_name', email: 'any_email', accessToken: 'any_token', createdAt: new Date(), updatedAt: new Date(),
  });
  jest.spyOn(userHasRoleRepository, 'findRoleById').mockResolvedValue({
    id: 'any_id', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
  });

  return {
    sut,
    userHasRoleRepository,
  };
};

describe('AddRoleToUserUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const userHasRoleRepositorySpy = jest.spyOn(userHasRoleRepository, 'findUserById');
    await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(userHasRoleRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should call findRoleById with correct role', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const userHasRoleRepositorySpy = jest.spyOn(userHasRoleRepository, 'findRoleById');
    await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(userHasRoleRepositorySpy).toHaveBeenCalledWith('any_roleId');
  });

  it('Should throw if findRoleById throws', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findRoleById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if role does not exists', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findRoleById').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingRoleError());
  });

  it('Should return an error if user already has the role', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'findUserById').mockResolvedValue({
      id: 'any_role',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [{
        id: 'any_roleId', role: 'any_role', createdAt: new Date(), updatedAt: new Date(),
      }],
    });
    const error = await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new UserAlreadyHaveThisRoleError());
  });

  it('Should call addRoleToUser with correct values', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    const userHasRoleRepositorySpy = jest.spyOn(userHasRoleRepository, 'addRoleToUser');
    await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(userHasRoleRepositorySpy).toHaveBeenCalledWith({ userId: 'any_userId', roleId: 'any_roleId' });
  });

  it('Should throw if addRoleToUser throws', async () => {
    const { sut, userHasRoleRepository } = makeSut();
    jest.spyOn(userHasRoleRepository, 'addRoleToUser').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an UserHasRole on success', async () => {
    const { sut } = makeSut();
    const response = await sut.execute({ userId: 'any_userId', roleId: 'any_roleId' });
    const value = response.value as IUserHasRoleRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({ userId: 'any_userId', roleId: 'any_roleId', createdAt: value.createdAt });
  });
});
