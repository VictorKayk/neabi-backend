import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/criptography';
import { IPayload } from '@/use-cases/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('any_secret', '30d');
  return {
    sut,
  };
};

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_encrypted_string'));
  },
  verify() {
    return { id: 'any_id' };
  },
}));

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const { sut } = makeSut();

    const jwtSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');
    expect(jwtSpy).toHaveBeenLastCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn: '30d' });
  });

  it('Should return an token on sign success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_encrypted_string');
  });

  it('Should throw if sign throws', async () => {
    const { sut } = makeSut();

    const jwtSpy = jest.spyOn(jwt, 'sign') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>;
    jwtSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const accessTokenError = sut.encrypt('any_id');
    await expect(accessTokenError).rejects.toThrow();
  });

  it('Should call verify with correct values', async () => {
    const { sut } = makeSut();

    const jwtSpy = jest.spyOn(jwt, 'verify');

    await sut.decrypt('any_encrypted_string');
    expect(jwtSpy).toHaveBeenLastCalledWith('any_encrypted_string', 'any_secret');
  });

  it('Should return a payload on verify success', async () => {
    const { sut } = makeSut();
    const response = await (await sut.decrypt('any_encrypted_string')).value as IPayload;
    expect(response).toEqual({ id: 'any_id' });
  });

  it('Should return an error if verify fails', async () => {
    const { sut } = makeSut();

    const jwtSpy = jest.spyOn(jwt, 'verify') as unknown as jest.Mock<ReturnType<(key: Error) => Error>, Parameters<(key: Error) => Error>>;
    jwtSpy.mockImplementation(() => { throw new Error(); });

    const accessTokenError = await sut.decrypt('any_encrypted_string');
    expect(accessTokenError.isError()).toBe(true);
    expect(accessTokenError.value).toEqual(new UnauthorizedError());
  });
});
