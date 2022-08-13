import { VerificationTokenRepository } from '@/infra/repositories';
import { UserBuilder } from '@/test/builders/user-builder';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: VerificationTokenRepository,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const sut = new VerificationTokenRepository();
  const user = new UserBuilder();

  return {
    sut,
    user,
  };
};

describe('VerificationTokenRepository Implementation', () => {
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
  it('Should return an account on findVerificationTokenByUserId success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.verificationToken, 'findFirst').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.findVerificationTokenByUserId('any_userId');
    expect(account?.userId).toBe('any_userId');
    expect(account?.token).toBe('any_token');
    expect(account?.isDeleted).toBe(false);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.expiresAt).toBeTruthy();
  });

  it('Should return null on findVerificationTokenByUserId fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.verificationToken, 'findFirst').mockResolvedValue(null);

    const account = await sut.findVerificationTokenByUserId('any_userId');
    expect(account).toBe(null);
  });

  it('Should return an VerificationToken on deleteVerificationTokenByUserId success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.verificationToken, 'update').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: true,
    });

    const verificationToken = await sut.deleteVerificationTokenByUserId('any_userId');
    expect(verificationToken).toEqual({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: verificationToken.createdAt,
      expiresAt: verificationToken.expiresAt,
      isDeleted: true,
    });
  });

  it('Should return an VerificationToken on add success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.verificationToken, 'create').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const verificationToken = await sut.add({ userId: 'any_userId', token: 'any_token', expiresInHours: 1 });
    expect(verificationToken).toEqual({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: verificationToken.createdAt,
      expiresAt: verificationToken.expiresAt,
      isDeleted: false,
    });
  });
});
