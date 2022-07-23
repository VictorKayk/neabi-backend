import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/criptography';

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);

  return {
    sut,
    salt,
  };
};

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  },
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

describe('Bcrypt Adapter', () => {
  it('Should calls hash with correct values', async () => {
    const { sut, salt } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_password');
    expect(hashSpy).toHaveBeenCalledWith('any_password', salt);
  });

  it('Should return a valid hash on hash success', async () => {
    const { sut } = makeSut();
    const hash = await sut.hash('any_password');
    expect(hash).toBe('hashed_password');
  });

  it('Should throw if hash throws', async () => {
    const { sut } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>;
    hashSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const hash = sut.hash('any_password');
    await expect(hash).rejects.toThrow();
  });

  it('Should calls hashCompare with correct values', async () => {
    const { sut } = makeSut();

    const hashCompareSpy = jest.spyOn(bcrypt, 'compare');

    await sut.compare('any_hash', 'any_password');
    expect(hashCompareSpy).toHaveBeenCalledWith('any_password', 'any_hash');
  });

  it('Should return a valid hashCompare on hashCompare success', async () => {
    const { sut } = makeSut();
    const hashCompare = await sut.compare('any_hash', 'any_password');
    expect(hashCompare).toBe(true);
  });

  it('Should throw if hashCompare throws', async () => {
    const { sut } = makeSut();

    const hashCompareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>;
    hashCompareSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const hashCompare = sut.compare('any_hash', 'any_password');
    await expect(hashCompare).rejects.toThrow();
  });
});
