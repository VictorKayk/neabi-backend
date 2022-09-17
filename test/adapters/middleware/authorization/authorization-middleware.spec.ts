import { AuthorizationUseCase } from '@/use-cases/authorization';
import { UnauthorizedError } from '@/use-cases/errors';
import { ServerError } from '@/adapters/errors';
import { serverError, unauthorized } from '@/adapters/utils/http';
import { makeAuthorizationUseCase } from '@/test/stubs';
import { error, success } from '@/shared';
import { AuthorizationMiddleware } from '@/adapters/middleware/authorization';

type SutTypes = {
  sut: AuthorizationMiddleware,
  useCase: AuthorizationUseCase,
};

const makeSut = (): SutTypes => {
  const useCase = makeAuthorizationUseCase();
  const sut = new AuthorizationMiddleware(useCase);

  jest.spyOn(useCase, 'execute').mockResolvedValue(success(null));

  return {
    sut,
    useCase,
  };
};

describe('Authorization Middleware', () => {
  it('Should call AuthorizationUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();
    const useCaseSpy = jest.spyOn(useCase, 'execute');
    await sut.handle({ userId: 'any_userId', allowedRoles: ['any_role'] });
    expect(useCaseSpy).toHaveBeenCalledWith({ allowedRoles: ['any_role'], userId: 'any_userId' });
  });

  it('Should return 500 if use case throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ userId: 'any_userId', allowedRoles: ['any_role'] });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ userId: 'any_userId', allowedRoles: ['any_role'] });
    expect(response.statusCode).toBe(200);
  });

  it('Should return 401 if call AuthorizationUseCase with incorrect values', async () => {
    const { sut, useCase } = makeSut();
    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new UnauthorizedError()));
    const response = await sut.handle({ userId: 'invalid_userId', allowedRoles: ['any_role'] });
    expect(response).toEqual(unauthorized(new UnauthorizedError()));
  });
});
