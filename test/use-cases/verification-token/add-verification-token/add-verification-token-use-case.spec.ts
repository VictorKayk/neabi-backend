import { makeUniversallyUniqueIdentifierGenerator } from '@/test/stubs/universally-unique-identifier-generator-stub';
import { makeHasher, makeVerificationTokenRepository } from '@/test/stubs';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IHasher, IUniversallyUniqueIdentifierGenerator, ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';

type SutTypes = {
  sut: AddVerificationTokenUseCase,
  verificationTokenRepository: IVerificationTokenRepository,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  tokenGenerator: IUniversallyUniqueIdentifierGenerator,
  hasher: IHasher,
};

const makeSut = (): SutTypes => {
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const tokenGenerator = makeUniversallyUniqueIdentifierGenerator();
  const verificationTokenRepository = makeVerificationTokenRepository();
  const hasher = makeHasher();
  const sut = new AddVerificationTokenUseCase(
    verificationTokenRepository, idGenerator, tokenGenerator, hasher,
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
  jest.spyOn(verificationTokenRepository, 'deleteVerificationTokenByUserId').mockResolvedValue();

  return {
    sut,
    verificationTokenRepository,
    idGenerator,
    tokenGenerator,
    hasher,
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

  it('Should call idGenerator if user does not have a verificationToken', async () => {
    const { sut, verificationTokenRepository, idGenerator } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    const tokenGeneratorSpy = jest.spyOn(idGenerator, 'generate');

    await sut.execute('any_userId');
    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if idGenerator throws', async () => {
    const { sut, verificationTokenRepository, idGenerator } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

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

  it('Should call Hasher with correct token', async () => {
    const {
      sut, hasher, verificationTokenRepository, tokenGenerator,
    } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
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
      verificationTokenRepository,
      tokenGenerator,
      hasher,
    } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    const verificationTokenRepositorySpy = jest.spyOn(verificationTokenRepository, 'add');

    await sut.execute('any_userId', 2);
    expect(verificationTokenRepositorySpy).toHaveBeenCalledWith({
      verificationTokenId: 'any_uuid', userId: 'any_userId', token: await hasher.hash(await tokenGenerator.generate()), expiresInHours: 2,
    });
  });

  it('Should throw add if throws', async () => {
    const { sut, verificationTokenRepository } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(verificationTokenRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.execute('any_userId');
    await expect(promise).rejects.toThrow();
  });

  it('Should return an Email validation token on success', async () => {
    const {
      sut, verificationTokenRepository, tokenGenerator, hasher,
    } = makeSut();

    jest.spyOn(verificationTokenRepository, 'findVerificationTokenByUserId').mockResolvedValue(null);
    jest.spyOn(verificationTokenRepository, 'add').mockResolvedValue({
      userId: 'any_userId',
      token: await hasher.hash(await tokenGenerator.generate()),
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.execute('any_userId');
    const value = response.value as {
      verificationToken: ITokenRepositoryReturnData, token: string
    };
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      verificationToken: {
        userId: 'any_userId',
        token: await hasher.hash(await tokenGenerator.generate()),
        createdAt: value.verificationToken.createdAt,
        expiresAt: value.verificationToken.expiresAt,
        isDeleted: false,
      },
      token: await tokenGenerator.generate(),
    });
  });
});
