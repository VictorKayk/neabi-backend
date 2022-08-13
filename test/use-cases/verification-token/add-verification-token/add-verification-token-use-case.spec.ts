import { makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs/universally-unique-identifier-generator-stub';
import { makeVerificationTokenRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { IVerificationTokenRepositoryReturnData, IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';

type SutTypes = {
  sut: AddVerificationTokenUseCase,
  verificationTokenRepository: IVerificationTokenRepository,
  tokenGenerator: IUniversallyUniqueIdentifierGenerator,
};

const makeSut = (): SutTypes => {
  const tokenGenerator = makeUniversallyUniqueIdentifierGenerator();
  const verificationTokenRepository = makeVerificationTokenRepository();
  const sut = new AddVerificationTokenUseCase(
    verificationTokenRepository, tokenGenerator,
  );

  jest.spyOn(verificationTokenRepository, 'findUserById').mockResolvedValue({
    id: 'any_role',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_token',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  });

  return {
    sut,
    verificationTokenRepository,
    tokenGenerator,
  };
};

describe('AddVerificationTokenUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'findUserById');
    await sut.execute('any_userId');
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute('any_userId');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should call findVerificationTokenByUserId with correct value', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId');

    await sut.execute('any_userId');
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findVerificationTokenByUserId throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();
    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call deleteVerificationTokenByUserId if user already has one', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });
    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'deleteVerificationTokenByUserId');

    await sut.execute('any_userId');
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if deleteVerificationTokenByUserId throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });
    jest.spyOn(verificationTokenRepository, 'deleteVerificationTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call tokenGenerator if user does not have a verificationToken', async () => {
    const { sut, verificationTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, 'generate');

    await sut.execute('any_userId');
    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if tokenGenerator throws', async () => {
    const { sut, verificationTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(tokenGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const {
      sut,
      verificationTokenRepository,
      tokenGenerator,
    } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'add');

    await sut.execute('any_userId', 2);
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith({ userId: 'any_userId', token: await tokenGenerator.generate(), expiresInHours: 2 });
  });

  it('Should throw add if throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(verificationTokenRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an Email validation token on success', async () => {
    const { sut, verificationTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(verificationTokenRepository, 'add').mockResolvedValue({
      userId: 'any_userId',
      token: await tokenGenerator.generate(),
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.execute('any_userId');
    const value = response.value as IVerificationTokenRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      userId: 'any_userId',
      token: await tokenGenerator.generate(),
      createdAt: value.createdAt,
      expiresAt: value.expiresAt,
      isDeleted: false,
    });
  });
});
