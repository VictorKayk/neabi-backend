import { getUserRoles } from '@/infra/repositories/utils';
import { UserRepository } from '@/infra/repositories';
import { UserBuilder } from '@/test/builders/user-builder';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: UserRepository,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const sut = new UserRepository();
  const user = new UserBuilder();

  return {
    sut,
    user,
  };
};

describe('User Repository Implementation', () => {
  it('Should return an account on add success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.add(user.build());
    expect(account.id).toBe(user.build().id);
    expect(account.name).toBe(user.build().name);
    expect(account.email).toBe(user.build().email);
    expect(account.password).toBe(user.build().password);
    expect(account.accessToken).toBe(user.build().accessToken);
    expect(account.createdAt).toBeTruthy();
    expect(account.updatedAt).toBeTruthy();
  });

  it('Should return an account on findByEmail success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.findByEmail(user.build().email);
    expect(account?.id).toBe(user.build().id);
    expect(account?.name).toBe(user.build().name);
    expect(account?.email).toBe(user.build().email);
    expect(account?.password).toBe(user.build().password);
    expect(account?.accessToken).toBe(user.build().accessToken);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.updatedAt).toBeTruthy();
  });

  it('Should return null on findByEmail fails', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    const account = await sut.findByEmail(user.build().email);
    expect(account).toBe(null);
  });

  it('Should return an account on findById success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.findById(user.build().id);
    expect(account?.id).toBe(user.build().id);
    expect(account?.name).toBe(user.build().name);
    expect(account?.email).toBe(user.build().email);
    expect(account?.password).toBe(user.build().password);
    expect(account?.accessToken).toBe(user.build().accessToken);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.updatedAt).toBeTruthy();
  });

  it('Should return null on findById fails', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    const account = await sut.findById(user.build().id);
    expect(account).toBe(null);
  });

  it('Should return all accounts with user roles', async () => {
    const { sut, user } = makeSut();

    const userRepositoryReturn = {
      ...user.build(),
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      userHasRoles: [{
        roles: {
          id: 'any_id',
          role: 'any_role',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      }],
    };
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(userRepositoryReturn);

    const correctUserRepositoryReturn = {
      name: userRepositoryReturn.name,
      createdAt: userRepositoryReturn.createdAt,
      updatedAt: userRepositoryReturn.updatedAt,
      isDeleted: userRepositoryReturn.isDeleted,
      id: userRepositoryReturn.id,
      email: userRepositoryReturn.email,
      password: userRepositoryReturn.password,
      accessToken: userRepositoryReturn.accessToken,
      roles: getUserRoles(userRepositoryReturn.userHasRoles),
    };
    const account = await sut.findById(user.build().id);
    expect(account).toEqual(correctUserRepositoryReturn);
  });

  it('Should return an account on updateByEmail success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.updateByEmail(user.build().email, user.build());
    expect(account.id).toBe(user.build().id);
    expect(account.name).toBe(user.build().name);
    expect(account.email).toBe(user.build().email);
    expect(account.password).toBe(user.build().password);
    expect(account.accessToken).toBe(user.build().accessToken);
    expect(account.createdAt).toBeTruthy();
    expect(account.updatedAt).toBeTruthy();
  });

  it('Should return an account on updateById success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.updateById(user.build().email, user.build());
    expect(account.id).toBe(user.build().id);
    expect(account.name).toBe(user.build().name);
    expect(account.email).toBe(user.build().email);
    expect(account.password).toBe(user.build().password);
    expect(account.accessToken).toBe(user.build().accessToken);
    expect(account.createdAt).toBeTruthy();
    expect(account.updatedAt).toBeTruthy();
  });

  it('Should return an account on deleteById success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
    });

    const account = await sut.deleteById(user.build().id);
    expect(account.id).toBe(user.build().id);
    expect(account.name).toBe(user.build().name);
    expect(account.email).toBe(user.build().email);
    expect(account.password).toBe(user.build().password);
    expect(account.accessToken).toBe(user.build().accessToken);
    expect(account.createdAt).toBeTruthy();
    expect(account.updatedAt).toBeTruthy();
  });

  it('Should return all accounts or an empty array on readAllUser success', async () => {
    const { sut, user } = makeSut();

    const userRepositoryReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      roles: [],
    };
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([userRepositoryReturn, userRepositoryReturn]);

    const account = await sut.readAllUsers({});
    expect(account).toEqual([userRepositoryReturn, userRepositoryReturn]);
  });

  it('Should return all accounts or an empty array on the first page', async () => {
    const { sut, user } = makeSut();

    const userRepositoryReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      roles: [],
    };
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([userRepositoryReturn, userRepositoryReturn]);

    const account = await sut.readAllUsers({ page: 1 });
    expect(account).toEqual([userRepositoryReturn, userRepositoryReturn]);
  });
});
