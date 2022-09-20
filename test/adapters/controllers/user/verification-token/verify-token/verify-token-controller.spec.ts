import { VerifyTokenUseCase } from '@/use-cases/user/verification-token/verify-token';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  serverError,
  badRequest,
  forbidden,
  ok,
  unauthorized,
} from '@/adapters/utils/http';
import {
  makeHashCompare,
  makeValidation,
  makeVerificationTokenRepository,
} from '@/test/stubs';
import { error, success } from '@/shared';
import { UserBuilder } from '@/../test/builders';
import { UserIsAlreadyVerifiedError } from '@/use-cases/user/verification-token/errors';
import { VerifyTokenController } from '@/adapters/controllers/user/verification-token/verify-token';
import { ExpiredTokenError, NonExistingTokenError } from '@/use-cases/errors';

type SutTypes = {
  sut: VerifyTokenController,
  validation: IValidation,
  verifyTokenUseCase: VerifyTokenUseCase,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const repository = makeVerificationTokenRepository();
  const hashCompare = makeHashCompare();
  const verifyTokenUseCase = new VerifyTokenUseCase(repository, hashCompare);
  const sut = new VerifyTokenController(validation, verifyTokenUseCase);

  const user = new UserBuilder();

  return {
    sut,
    validation,
    verifyTokenUseCase,
    user,
  };
};

describe('VerifyTokenController ', () => {
  it('Should call verifyTokenUseCase with correct values', async () => {
    const { sut, verifyTokenUseCase, user } = makeSut();
    const useCaseSpy = jest.spyOn(verifyTokenUseCase, 'execute');
    await sut.handle({ params: { userId: user.build().id, token: 'any_token' } });
    expect(useCaseSpy).toHaveBeenCalledWith({ userId: user.build().id, token: 'any_token' });
  });

  it('Should return 500 if verifyTokenUseCase throws', async () => {
    const { sut, verifyTokenUseCase, user } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ params: { userId: user.build().id, token: 'any_token' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 403 if user do not exists in verifyTokenUseCase', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new NonExistingUserError()));
    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' } });

    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should return 401 if user is already verified', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new UserIsAlreadyVerifiedError()));

    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' } });

    expect(response).toEqual(unauthorized(new UserIsAlreadyVerifiedError()));
  });

  it('Should return 403 if token do not exists in verifyTokenUseCase', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new NonExistingTokenError()));
    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' } });

    expect(response).toEqual(forbidden(new NonExistingTokenError()));
  });

  it('Should return 403 if token is already expired', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new ExpiredTokenError()));
    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' } });

    expect(response).toEqual(forbidden(new ExpiredTokenError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_userId',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: true,
      roles: [],
    }));

    const response = await sut.handle({ params: { userId: 'any_userId', token: 'any_token' } });

    expect(response.statusCode).toBe(200);
    expect(response).toEqual(ok({
      id: 'any_userId',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: response.body.createdAt,
      updatedAt: response.body.updatedAt,
      isVerified: true,
    }));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ params: { userId: 'any_userId', token: 'any_token' } });
    expect(validationSpy).toHaveBeenCalledWith({ userId: 'any_userId', token: 'any_token' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ params: { userId: 'any_userId', token: 'any_token' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
