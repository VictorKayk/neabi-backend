import { Authentication } from '@/use-cases/authentication';
import { IDecrypter } from '@/use-cases/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';
import { ServerError } from '@/adapters/errors';
import { serverError, unauthorized } from '@/adapters/util/http';
import { makeAuthenticationUseCase, makeDecrypter } from '@/test/stubs';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { AuthenticationMiddleware } from '@/adapters/middleware/authentication-middleware';

type SutTypes = {
  sut: AuthenticationMiddleware,
  useCase: Authentication,
  decrypter: IDecrypter,
  user: UserBuilder
};

const makeSut = (): SutTypes => {
  const useCase = makeAuthenticationUseCase();
  const sut = new AuthenticationMiddleware(useCase);

  const decrypter = makeDecrypter();

  const user = new UserBuilder();
  jest.spyOn(useCase, 'execute').mockResolvedValue(success(user.build()));

  return {
    sut,
    useCase,
    decrypter,
    user,
  };
};

describe('Authentication Middleware', () => {
  it('Should call Authentication use case with correct values', async () => {
    const { sut, useCase } = makeSut();
    const useCaseSpy = jest.spyOn(useCase, 'execute');
    await sut.handle('any_encrypted_string');

    expect(useCaseSpy).toHaveBeenCalledWith('any_encrypted_string');
  });

  it('Should return 500 if use case throws', async () => {
    const { sut, useCase } = makeSut();
    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle('any_encrypted_string');

    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, user } = makeSut();
    const response = await sut.handle('any_encrypted_string');

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBe('any_encrypted_string');
    expect(response.body.id).toBe(user.build().id);
  });

  it('Should return 401 if call Authentication use case with incorrect values', async () => {
    const { sut, useCase } = makeSut();
    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new UnauthorizedError()));
    const response = await sut.handle('invalid_token');

    expect(response).toEqual(unauthorized(new UnauthorizedError()));
  });
});
