import { makeHashCompare, makeResetUserPasswordTokenRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { IResetUserPasswordTokenRepository } from '@/use-cases/user/reset-user-password/interfaces';
import { VerifyTokenUseCase } from '@/use-cases/user/reset-user-password/verify-reset-user-password-token';
import { UserBuilder } from '@/test/builders';
import { IHashCompare } from '@/use-cases/interfaces';
import { ExpiredTokenError, InvalidTokenError, NonExistingTokenError } from '@/use-cases/errors';

type SutTypes = {
  sut: VerifyTokenUseCase,
  hashCompare: IHashCompare,
  resetUserPasswordTokenRepository: IResetUserPasswordTokenRepository,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const resetUserPasswordTokenRepository = makeResetUserPasswordTokenRepository();
  const hashCompare = makeHashCompare();
  const sut = new VerifyTokenUseCase(resetUserPasswordTokenRepository, hashCompare);
  const user = new UserBuilder();

  jest.spyOn(resetUserPasswordTokenRepository, 'findUserById').mockResolvedValue({
    id: 'any_userId',
    name: 'any_name',
    email: 'any_email@test.com',
    accessToken: 'any_encrypted_string',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  });
  jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue({
    userId: 'any_userId',
    token: 'any_hashToken',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 36000000),
    isDeleted: false,
  });

  return {
    sut,
    hashCompare,
    resetUserPasswordTokenRepository,
    user,
  };
};

describe('VerifyTokenUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'findUserById');
    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', token: 'any_token' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should call findResetUserPasswordToken with correct value', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();

    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId');

    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findResetUserPasswordToken throws', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', token: 'any_token' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if resetUserPassword token does not exists', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingTokenError());
  });

  it('Should return an error if resetUserPassword token is already expired', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_hashToken',
      createdAt: new Date(),
      expiresAt: new Date('2020-12-31'),
      isDeleted: false,
    });
    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new ExpiredTokenError());
  });

  it('Should call HashCompare with correct token', async () => {
    const { sut, hashCompare } = makeSut();
    const hashCompareSpy = jest.spyOn(hashCompare, 'compare');
    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(hashCompareSpy).toHaveBeenCalledWith('any_hashToken', 'any_token');
  });

  it('Should throw if HashCompare throws', async () => {
    const { sut, hashCompare } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockRejectedValue(new Error());
    const promise = sut.execute({ userId: 'any_userId', token: 'any_token' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if HashCompare fails', async () => {
    const { sut, hashCompare } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.value)
      .toEqual(new InvalidTokenError());
  });

  it('Should call deleteResetUserPasswordTokenByUserId with correct value', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'deleteResetUserPasswordTokenByUserId');
    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should return an user on success', async () => {
    const { sut, user } = makeSut();

    const response = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    const value = response.value as IUserRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      id: 'any_userId',
      name: user.build().name,
      email: user.build().email,
      accessToken: user.build().accessToken,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      isDeleted: false,
      isVerified: false,
      roles: [],
    });
  });
});
