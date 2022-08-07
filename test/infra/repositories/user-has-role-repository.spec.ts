import { UserHasRoleRepository } from '@/infra/repositories';
import { UserBuilder } from '@/test/builders/user-builder';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: UserHasRoleRepository,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const sut = new UserHasRoleRepository();
  const user = new UserBuilder();

  return {
    sut,
    user,
  };
};

describe('UserHasRoleRepository Implementation', () => {
  it('Should return an role on findRoleById success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue({
      id: 'any_roleId',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.findRoleById('any_roleId');
    expect(response?.id).toBe('any_roleId');
    expect(response?.role).toBe('any_role');
    expect(response?.createdAt).toBeTruthy();
  });

  it('Should return null on findRoleById fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue(null);

    const response = await sut.findRoleById('any_roleId');
    expect(response).toBe(null);
  });

  it('Should return an account on findUserById success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      id: 'any_userId',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.findUserById('any_userId');
    expect(account?.id).toBe('any_userId');
    expect(account?.name).toBe(user.build().name);
    expect(account?.email).toBe(user.build().email);
    expect(account?.password).toBe(user.build().password);
    expect(account?.accessToken).toBe(user.build().accessToken);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.updatedAt).toBeTruthy();
  });

  it('Should return null on findUserById fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    const account = await sut.findUserById('any_userId');
    expect(account).toBe(null);
  });

  it('Should return an role on findUserHasRole success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.userHasRoles, 'findFirst').mockResolvedValue({
      userId: 'any_userId',
      roleId: 'any_roleId',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.findUserHasRole({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(response?.userId).toBe('any_userId');
    expect(response?.roleId).toBe('any_roleId');
    expect(response?.createdAt).toBeTruthy();
  });

  it('Should return null on findUserHasRole fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.userHasRoles, 'findFirst').mockResolvedValue(null);

    const response = await sut.findUserHasRole({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(response).toBe(null);
  });

  it('Should return an RoleOnUser on addRoleToUser success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.userHasRoles, 'create').mockResolvedValue({
      userId: 'any_userId',
      roleId: 'any_roleId',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const roleOnUser = await sut.addRoleToUser({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(roleOnUser).toEqual({
      userId: 'any_userId',
      roleId: 'any_roleId',
      createdAt: roleOnUser.createdAt,
      updatedAt: roleOnUser.updatedAt,
      isDeleted: false,
    });
  });

  it('Should return an RoleOnUser on removeRoleFromUser success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.userHasRoles, 'update').mockResolvedValue({
      userId: 'any_userId',
      roleId: 'any_roleId',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
    });

    const roleOnUser = await sut.removeRoleFromUser({ userId: 'any_userId', roleId: 'any_roleId' });
    expect(roleOnUser).toEqual({
      userId: 'any_userId',
      roleId: 'any_roleId',
      createdAt: roleOnUser.createdAt,
      updatedAt: roleOnUser.updatedAt,
      isDeleted: true,
    });
  });
});
