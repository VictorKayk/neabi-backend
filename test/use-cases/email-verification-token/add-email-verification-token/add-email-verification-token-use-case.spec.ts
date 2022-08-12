import { makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs/universally-unique-identifier-generator-stub';
import { makeEmailVerificationTokenRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { IEmailValidationTokenRepositoryReturnData, IEmailVerificationTokenRepository } from '@/use-cases/email-verification-token/interfaces';
import { AddEmailVerificationTokenUseCase } from '@/use-cases/email-verification-token/add-email-verification-token';

type SutTypes = {
  sut: AddEmailVerificationTokenUseCase,
  emailVerificationTokenRepository: IEmailVerificationTokenRepository,
  tokenGenerator: IUniversallyUniqueIdentifierGenerator,
};

const makeSut = (): SutTypes => {
  const tokenGenerator = makeUniversallyUniqueIdentifierGenerator();
  const emailVerificationTokenRepository = makeEmailVerificationTokenRepository();
  const sut = new AddEmailVerificationTokenUseCase(
    emailVerificationTokenRepository, tokenGenerator,
  );

  jest.spyOn(emailVerificationTokenRepository, 'findUserById').mockResolvedValue({
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
    emailVerificationTokenRepository,
    tokenGenerator,
  };
};

describe('AddEmailVerificationTokenUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();
    const emailVerificationTokenRepositorySpy = jest.spyOn(emailVerificationTokenRepository, 'findUserById');
    await sut.execute('any_userId');
    expect(emailVerificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();
    jest.spyOn(emailVerificationTokenRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();
    jest.spyOn(emailVerificationTokenRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute('any_userId');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should call findEmailValidationTokenByUserId with correct value', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();

    const emailVerificationTokenRepositorySpy = jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId');

    await sut.execute('any_userId');
    expect(emailVerificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findEmailValidationTokenByUserId throws', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();
    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call deleteEmailValidationTokenByUserId if user already has one', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });
    const emailVerificationTokenRepositorySpy = jest.spyOn(emailVerificationTokenRepository, 'deleteEmailValidationTokenByUserId');

    await sut.execute('any_userId');
    expect(emailVerificationTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if deleteEmailValidationTokenByUserId throws', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });
    jest.spyOn(emailVerificationTokenRepository, 'deleteEmailValidationTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call tokenGenerator if user does not have a emailVerificationToken', async () => {
    const { sut, emailVerificationTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue(null);
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, 'generate');

    await sut.execute('any_userId');
    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if tokenGenerator throws', async () => {
    const { sut, emailVerificationTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(tokenGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const {
      sut,
      emailVerificationTokenRepository,
      tokenGenerator,
    } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue(null);
    const emailVerificationTokenRepositorySpy = jest.spyOn(emailVerificationTokenRepository, 'add');

    await sut.execute('any_userId', 2);
    expect(emailVerificationTokenRepositorySpy).toHaveBeenCalledWith({ userId: 'any_userId', token: await tokenGenerator.generate(), expiresInHours: 2 });
  });

  it('Should throw add if throws', async () => {
    const { sut, emailVerificationTokenRepository } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(emailVerificationTokenRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an Email validation token on success', async () => {
    const { sut, emailVerificationTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(emailVerificationTokenRepository, 'findEmailValidationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(emailVerificationTokenRepository, 'add').mockResolvedValue({
      userId: 'any_userId',
      token: await tokenGenerator.generate(),
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.execute('any_userId');
    const value = response.value as IEmailValidationTokenRepositoryReturnData;
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
