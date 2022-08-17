import {
  UserIsAlreadyVerifiedError, NonExistingTokenError, ExpiredTokenError, InvalidTokenError,
} from '@/use-cases/verification-token/errors';
import { makeHashCompare, makeVerificationTokenRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';
import { VerifyTokenUseCase } from '@/use-cases/verification-token/verify-token';
import { UserBuilder } from '@/test/builders';
import { IHashCompare } from '@/use-cases/interfaces';

type SutTypes = {
  sut: VerifyTokenUseCase,
  hashCompare: IHashCompare,
  verificationTokenRepository: IVerificationTokenRepository,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const verificationTokenRepository = makeVerificationTokenRepository();
  const hashCompare = makeHashCompare();
  const sut = new VerifyTokenUseCase(verificationTokenRepository, hashCompare);
  const user = new UserBuilder();

  jest.spyOn(verificationTokenRepository, 'findUserById').mockResolvedValue({
    id: 'any_userId',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_token',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  });
  jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue({
    userId: 'any_userId',
    token: 'any_hashToken',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 36000000),
    isDeleted: false,
  });

  return {
    sut,
    hashCompare,
    verificationTokenRepository,
    user,
  };
};

describe('VerifyTokenUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'findUserById');
    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', token: 'any_token' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should return an error if user is already verified', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findUserById').mockResolvedValue({
      id: 'any_userId',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: true,
      roles: [],
    });

    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new UserIsAlreadyVerifiedError());
  });

  it('Should call findVerificationToken with correct value', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId');

    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findVerificationToken throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ userId: 'any_userId', token: 'any_token' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if verification token does not exists', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    const error = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingTokenError());
  });

  it('Should return an error if verification token is already expired', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue({
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
    const { sut, user, hashCompare } = makeSut();
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

  it('Should call deleteVerificationTokenByUserId with correct value', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'deleteVerificationTokenByUserId');
    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should call updateUserVerification with correct value', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'updateUserVerification');

    await sut.execute({ userId: 'any_userId', token: 'any_token' });
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId', true);
  });

  it('Should throw if updateUserVerification throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'updateUserVerification').mockImplementation(() => {
      throw new Error();
    });
    const promise = sut.execute({ userId: 'any_userId', token: 'any_token' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an user with isVerified true on success', async () => {
    const { sut, verificationTokenRepository, user } = makeSut();

    jest.spyOn(verificationTokenRepository, 'updateUserVerification');

    const response = await sut.execute({ userId: 'any_userId', token: 'any_token' });
    const value = response.value as IUserRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      ...user.build(),
      id: 'any_userId',
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      isDeleted: false,
      isVerified: true,
      roles: [],
    });
  });
});
