import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/criptography';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
}));

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('any_secret');
  return {
    sut,
  };
};

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut } = makeSut();
    const jwtSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_id');
    expect(jwtSpy).toHaveBeenLastCalledWith({ id: 'any_id' }, 'any_secret');
  });

  test('Should return an token on sign success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });

  test('Should throw if sign throws', async () => {
    const { sut } = makeSut();
    const jwtSpy = jest.spyOn(jwt, 'sign') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>;
    jwtSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const accessTokenError = sut.encrypt('any_id');
    await expect(accessTokenError).rejects.toThrow();
  });
});
