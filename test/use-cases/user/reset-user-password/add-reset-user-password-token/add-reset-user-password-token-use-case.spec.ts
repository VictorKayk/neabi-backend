import { makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs/universally-unique-identifier-generator-stub';
import { makeHasher, makeResetUserPasswordTokenRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IHasher, IUniversallyUniqueIdentifierGenerator, ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IResetUserPasswordTokenRepository } from '@/use-cases/user/reset-user-password/interfaces';
import { AddResetUserPasswordTokenUseCase } from '@/use-cases/user/reset-user-password/add-reset-user-password-token';

type SutTypes = {
  sut: AddResetUserPasswordTokenUseCase,
  resetUserPasswordTokenRepository: IResetUserPasswordTokenRepository,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  tokenGenerator: IUniversallyUniqueIdentifierGenerator,
  hasher: IHasher,
};

const makeSut = (): SutTypes => {
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const tokenGenerator = makeUniversallyUniqueIdentifierGenerator();
  const resetUserPasswordTokenRepository = makeResetUserPasswordTokenRepository();
  const hasher = makeHasher();
  const sut = new AddResetUserPasswordTokenUseCase(
    resetUserPasswordTokenRepository, idGenerator, tokenGenerator, hasher,
  );

  jest.spyOn(resetUserPasswordTokenRepository, 'findUserById').mockResolvedValue({
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
  jest.spyOn(resetUserPasswordTokenRepository, 'deleteResetUserPasswordTokenByUserId').mockResolvedValue();

  return {
    sut,
    resetUserPasswordTokenRepository,
    idGenerator,
    tokenGenerator,
    hasher,
  };
};

describe('AddResetUserPasswordTokenUseCase', () => {
  it('Should call findUserById with correct value', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'findUserById');
    await sut.execute('any_userId');
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findUserById throws', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findUserById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user does not exists', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findUserById').mockResolvedValue(null);
    const error = await sut.execute('any_userId');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new NonExistingUserError());
  });

  it('Should call findResetUserPasswordTokenByUserId with correct value', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();

    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId');

    await sut.execute('any_userId');
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if findResetUserPasswordTokenByUserId throws', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();
    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call deleteResetUserPasswordTokenByUserId if user already has one', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });
    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'deleteResetUserPasswordTokenByUserId');

    await sut.execute('any_userId');
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith('any_userId');
  });

  it('Should throw if deleteResetUserPasswordTokenByUserId throws', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue({
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });
    jest.spyOn(resetUserPasswordTokenRepository, 'deleteResetUserPasswordTokenByUserId').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call idGenerator if user does not have a resetUserPasswordToken', async () => {
    const { sut, resetUserPasswordTokenRepository, idGenerator } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    const tokenGeneratorSpy = jest.spyOn(idGenerator, 'generate');

    await sut.execute('any_userId');
    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if idGenerator throws', async () => {
    const { sut, resetUserPasswordTokenRepository, idGenerator } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call tokenGenerator if user does not have a resetUserPasswordToken', async () => {
    const { sut, resetUserPasswordTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, 'generate');

    await sut.execute('any_userId');
    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if tokenGenerator throws', async () => {
    const { sut, resetUserPasswordTokenRepository, tokenGenerator } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    jest.spyOn(tokenGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call Hasher with correct token', async () => {
    const {
      sut, hasher, resetUserPasswordTokenRepository, tokenGenerator,
    } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    const hasherSpy = jest.spyOn(hasher, 'hash');

    await sut.execute('any_userId');
    expect(hasherSpy).toHaveBeenCalledWith(await tokenGenerator.generate());
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, hasher } = makeSut();
    jest.spyOn(hasher, 'hash').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const {
      sut,
      resetUserPasswordTokenRepository,
      tokenGenerator,
      hasher,
    } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    const resetUserPasswordTokenRepositorySpy = jest.spyOn(resetUserPasswordTokenRepository, 'add');

    await sut.execute('any_userId', 2);
    expect(resetUserPasswordTokenRepositorySpy).toHaveBeenCalledWith({
      resetUserPasswordTokenId: 'any_uuid', userId: 'any_userId', token: await hasher.hash(await tokenGenerator.generate()), expiresInHours: 2,
    });
  });

  it('Should throw add if throws', async () => {
    const { sut, resetUserPasswordTokenRepository } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    jest.spyOn(resetUserPasswordTokenRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an reset password token on success', async () => {
    const {
      sut, resetUserPasswordTokenRepository, tokenGenerator, hasher,
    } = makeSut();

    jest.spyOn(resetUserPasswordTokenRepository, 'findResetUserPasswordTokenByUserId').mockResolvedValue(null);
    jest.spyOn(resetUserPasswordTokenRepository, 'add').mockResolvedValue({
      userId: 'any_userId',
      token: await hasher.hash(await tokenGenerator.generate()),
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.execute('any_userId');
    const value = response.value as {
      resetUserPasswordToken: ITokenRepositoryReturnData, token: string
    };
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      resetUserPasswordToken: {
        userId: 'any_userId',
        token: await hasher.hash(await tokenGenerator.generate()),
        createdAt: value.resetUserPasswordToken.createdAt,
        expiresAt: value.resetUserPasswordToken.expiresAt,
        isDeleted: false,
      },
      token: await tokenGenerator.generate(),
    });
  });
});
