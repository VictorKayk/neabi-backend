import { EmailVerificationTokenRepository } from '@/infra/repositories';
import { UserBuilder } from '@/test/builders/user-builder';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: EmailVerificationTokenRepository,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const sut = new EmailVerificationTokenRepository();
  const user = new UserBuilder();

  return {
    sut,
    user,
  };
};

describe('EmailVerificationTokenRepository Implementation', () => {
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
  it('Should return an account on findEmailValidationTokenByUserId success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.emailVerificationToken, 'findFirst').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const account = await sut.findEmailValidationTokenByUserId('any_userId');
    expect(account?.userId).toBe('any_userId');
    expect(account?.token).toBe('any_token');
    expect(account?.isDeleted).toBe(false);
    expect(account?.createdAt).toBeTruthy();
    expect(account?.expiresAt).toBeTruthy();
  });

  it('Should return null on findEmailValidationTokenByUserId fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.emailVerificationToken, 'findFirst').mockResolvedValue(null);

    const account = await sut.findEmailValidationTokenByUserId('any_userId');
    expect(account).toBe(null);
  });

  it('Should return an EmailValidationToken on deleteEmailValidationTokenByUserId success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.emailVerificationToken, 'update').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: true,
    });

    const emailVerificationToken = await sut.deleteEmailValidationTokenByUserId('any_userId');
    expect(emailVerificationToken).toEqual({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: emailVerificationToken.createdAt,
      expiresAt: emailVerificationToken.expiresAt,
      isDeleted: true,
    });
  });

  it('Should return an EmailValidationToken on add success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.emailVerificationToken, 'create').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const emailVerificationToken = await sut.add({ userId: 'any_userId', token: 'any_token', expiresInHours: 1 });
    expect(emailVerificationToken).toEqual({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: emailVerificationToken.createdAt,
      expiresAt: emailVerificationToken.expiresAt,
      isDeleted: false,
    });
  });
});
