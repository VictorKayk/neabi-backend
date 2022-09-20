import { ResetUserPasswordTokenRepository } from '@/infra/repositories';
import { UserBuilder } from '@/test/builders/user-builder';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: ResetUserPasswordTokenRepository,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const sut = new ResetUserPasswordTokenRepository();
  const user = new UserBuilder();

  return {
    sut,
    user,
  };
};

describe('ResetUserPasswordTokenRepository Implementation', () => {
  it('Should return an account on findUserById success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      id: 'any_userId',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
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

  it('Should return an account on findResetUserPasswordTokenByUserId success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.token, 'findFirst')
      .mockResolvedValue({
        userId: user.build().id,
        token: 'any_token',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      });
    jest.spyOn(prisma.resetUserPasswordToken, 'findFirst').mockResolvedValue({
      id: 'any_id',
      token: 'any_token',
    });

    const account = await sut.findResetUserPasswordTokenByUserId('any_userId');
    expect(account?.userId).toBe('any_uuid');
    expect(account?.token).toBe('any_token');
    expect(account?.isDeleted).toBe(false);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.expiresAt).toBeTruthy();
  });

  it('Should return null on findResetUserPasswordTokenByUserId fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.resetUserPasswordToken, 'findFirst').mockResolvedValue(null);

    const account = await sut.findResetUserPasswordTokenByUserId('any_userId');
    expect(account).toBe(null);
  });

  it('Should return void on deleteResetUserPasswordTokenByUserId success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.resetUserPasswordToken, 'update').mockResolvedValue({
      id: 'any_id',
      token: 'any_token',
    });

    const resetUserPasswordToken = sut.deleteResetUserPasswordTokenByUserId('any_userId');
    expect(resetUserPasswordToken).toBeTruthy();
  });

  it('Should return an ResetUserPasswordToken on add success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.token, 'create').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      isDeleted: false,
      createdAt: new Date(),
      expiresAt: new Date(),
    });

    jest.spyOn(prisma.resetUserPasswordToken, 'create').mockResolvedValue({
      id: 'any_id',
      token: 'any_token',
    });

    const resetUserPasswordToken = await sut.add({
      resetUserPasswordTokenId: 'any_id', userId: 'any_userId', token: 'any_token', expiresInHours: 1,
    });
    expect(resetUserPasswordToken).toEqual({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: resetUserPasswordToken.createdAt,
      expiresAt: resetUserPasswordToken.expiresAt,
      isDeleted: false,
    });
  });

  it('Should return an account on updateUserResetUserPassword success', async () => {
    const { sut, user } = makeSut();

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      id: 'any_userId',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: true,
    });

    const account = await sut.updateUserResetUserPassword('any_userId', true);
    expect(account?.id).toBe('any_userId');
    expect(account?.name).toBe(user.build().name);
    expect(account?.email).toBe(user.build().email);
    expect(account?.password).toBe(user.build().password);
    expect(account?.accessToken).toBe(user.build().accessToken);
    expect(account?.isVerified).toBe(true);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.updatedAt).toBeTruthy();
  });
});
