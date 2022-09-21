import { VerifyResetUserPasswordTokenUseCase } from '@/use-cases/user/reset-user-password/verify-reset-user-password-token';
import { ExistingUserError, NonExistingUserError } from '@/use-cases/user/errors';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  serverError,
  badRequest,
  forbidden,
  ok,
} from '@/adapters/utils/http';
import {
  makeHashCompare,
  makeValidation,
  makeResetUserPasswordTokenRepository,
  makeUpdateUserUseCase,
} from '@/test/stubs';
import { error, success } from '@/shared';
import { UserBuilder } from '@/../test/builders';
import { VerifyResetUserPasswordTokenController } from '@/adapters/controllers/user/reset-user-password/verify-reset-user-password-token';
import { ExpiredTokenError, NonExistingTokenError } from '@/use-cases/errors';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { InvalidPasswordError } from '@/entities/value-object/errors';

type SutTypes = {
  sut: VerifyResetUserPasswordTokenController,
  validation: IValidation,
  verifyTokenUseCase: VerifyResetUserPasswordTokenUseCase,
  updateUserUseCase: UpdateUserUseCase,
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const repository = makeResetUserPasswordTokenRepository();
  const hashCompare = makeHashCompare();
  const verifyTokenUseCase = new VerifyResetUserPasswordTokenUseCase(repository, hashCompare);
  const updateUserUseCase = makeUpdateUserUseCase();
  const sut = new VerifyResetUserPasswordTokenController(
    validation, verifyTokenUseCase, updateUserUseCase,
  );

  const user = new UserBuilder();

  jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    accessToken: 'any_token',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  }));

  return {
    sut,
    validation,
    verifyTokenUseCase,
    updateUserUseCase,
    user,
  };
};

describe('VerifyResetUserPasswordTokenController ', () => {
  it('Should call verifyTokenUseCase with correct values', async () => {
    const { sut, verifyTokenUseCase, user } = makeSut();
    const useCaseSpy = jest.spyOn(verifyTokenUseCase, 'execute');
    await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: 'new_password1' } });
    expect(useCaseSpy).toHaveBeenCalledWith({ userId: user.build().id, token: 'any_token' });
  });

  it('Should return 500 if verifyTokenUseCase throws', async () => {
    const { sut, verifyTokenUseCase, user } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: 'new_password1' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 403 if user do not exists in verifyTokenUseCase', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new NonExistingUserError()));
    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' }, body: { password: 'new_password1' } });

    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should return 403 if token do not exists in verifyTokenUseCase', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new NonExistingTokenError()));
    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' }, body: { password: 'new_password1' } });

    expect(response).toEqual(forbidden(new NonExistingTokenError()));
  });

  it('Should return 403 if token is already expired', async () => {
    const { sut, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(error(new ExpiredTokenError()));
    const response = await sut.handle({ params: { userId: 'invalid_userId', token: 'any_token' }, body: { password: 'new_password1' } });

    expect(response).toEqual(forbidden(new ExpiredTokenError()));
  });

  it('Should call UpdateUserUseCase with correct values', async () => {
    const {
      sut, verifyTokenUseCase, updateUserUseCase, user,
    } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    const updateUserUseCaseSpy = jest.spyOn(updateUserUseCase, 'execute');

    await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: 'new_password1' } });
    expect(updateUserUseCaseSpy).toHaveBeenCalledWith({
      id: 'any_id',
      userData: { password: 'new_password1' },
    });
  });

  it('Should return 500 if throws', async () => {
    const {
      sut, verifyTokenUseCase, updateUserUseCase, user,
    } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    jest.spyOn(updateUserUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: 'new_password1' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 403 if user do not exists', async () => {
    const {
      sut, verifyTokenUseCase, updateUserUseCase, user,
    } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    jest.spyOn(updateUserUseCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new NonExistingUserError()),
    )));

    const response = await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: 'new_password1' } });
    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should return 403 if user already exists', async () => {
    const {
      sut, verifyTokenUseCase, updateUserUseCase, user,
    } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    jest.spyOn(updateUserUseCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new ExistingUserError()),
    )));

    const response = await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: 'new_password1' } });
    expect(response).toEqual(forbidden(new ExistingUserError()));
  });

  it('Should return 400 if call UpdateUserUseCase with incorrect values', async () => {
    const { sut, user, verifyTokenUseCase } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    const response = await sut.handle({ params: { userId: user.build().id, token: 'any_token' }, body: { password: '' } });
    expect(response).toEqual(badRequest(new InvalidPasswordError('')));
  });

  it('Should return 200 on success', async () => {
    const {
      sut, verifyTokenUseCase, updateUserUseCase, user,
    } = makeSut();

    jest.spyOn(verifyTokenUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(success({
      id: 'any_id',
      name: user.build().name,
      email: user.build().email,
      accessToken: 'any_token',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

    const response = await sut.handle({ params: { userId: 'any_id', token: 'any_token' }, body: { password: 'new_password1' } });

    expect(response.statusCode).toBe(200);
    expect(response).toEqual(ok({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@test.com',
      accessToken: 'any_token',
      createdAt: response.body.createdAt,
      updatedAt: response.body.updatedAt,
      isVerified: false,
    }));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ params: { userId: 'any_id', token: 'any_token' } });
    expect(validationSpy).toHaveBeenCalledWith({ userId: 'any_id', token: 'any_token' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ params: { userId: 'any_id', token: 'any_token' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
