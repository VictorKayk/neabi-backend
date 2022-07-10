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
}));

describe('Bcrypt Adapter', () => {
  test('Should calls hash with correct values', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_password');
    expect(hashSpy).toHaveBeenCalledWith('any_password', salt);
  });

  test('Should return a valid hash on hash success', async () => {
    const { sut } = makeSut();
    const hash = await sut.hash('any_password');
    expect(hash).toBe('hashed_password');
  });

  test('Should throw if hash throws', async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>;
    hashSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const hash = sut.hash('any_password');
    await expect(hash).rejects.toThrow();
  });
});
