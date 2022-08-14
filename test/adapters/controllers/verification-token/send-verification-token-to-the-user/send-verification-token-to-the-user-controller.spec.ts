import { UserIsAlreadyVerifiedError } from '@/adapters/controllers/verification-token/errors/user-is-already-verified-error';
import { SendVerificationTokenUseCase } from '@/use-cases/verification-token/send-verification-token';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { SendVerificationTokenToUserController } from '@/adapters/controllers/verification-token/send-verification-token-to-user';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  serverError,
  badRequest,
  forbidden,
  ok,
  unauthorized,
} from '@/adapters/util/http';
import {
  makeFakeRequest,
  makeEncrypter,
  makeUniversallyUniqueIdentifierGenerator,
  makeValidation,
  makeAddVerificationTokenUseCase,
  makeSendVerificationTokenUseCase,
  makeUserRepository,
} from '@/test/stubs';
import { error, success } from '@/shared';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';
import { EmailServiceError } from '@/use-cases/errors';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { UserBuilder } from '@/../test/builders';

type SutTypes = {
  sut: SendVerificationTokenToUserController,
  validation: IValidation,
  readUserUseCase: ReadUserUseCase,
  addVerificationTokenUseCase: AddVerificationTokenUseCase,
  sendVerificationToken: SendVerificationTokenUseCase,
  user: UserBuilder,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  encrypter: IEncrypter,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const repository = makeUserRepository();
  const readUserUseCase = new ReadUserUseCase(repository);
  const addVerificationTokenUseCase = makeAddVerificationTokenUseCase();
  const sendVerificationToken = makeSendVerificationTokenUseCase();

  const sut = new SendVerificationTokenToUserController(
    validation, addVerificationTokenUseCase, readUserUseCase, sendVerificationToken,
  );

  const user = new UserBuilder();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const encrypter = makeEncrypter();

  const useCaseReturn = {
    ...user.build(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  };
  jest.spyOn(readUserUseCase, 'execute').mockResolvedValue(success(useCaseReturn));

  return {
    sut,
    validation,
    readUserUseCase,
    addVerificationTokenUseCase,
    sendVerificationToken,
    user,
    idGenerator,
    encrypter,
  };
};

describe('SendVerificationTokenToUserController ', () => {
  it('Should call ReadUserUseCase with correct values', async () => {
    const { sut, readUserUseCase, user } = makeSut();

    const useCaseSpy = jest.spyOn(readUserUseCase, 'execute');

    await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(useCaseSpy).toHaveBeenCalledWith(user.build().id);
  });

  it('Should return 500 if ReadUserUseCase throws', async () => {
    const { sut, readUserUseCase, user } = makeSut();

    jest.spyOn(readUserUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 403 if user do not exists in ReadUserUseCase', async () => {
    const { sut, readUserUseCase } = makeSut();

    jest.spyOn(readUserUseCase, 'execute').mockResolvedValue(error(new NonExistingUserError()));
    const response = await sut.handle({
      user: {
        id: 'invalid_id',
        accessToken: 'any_accessToken',
      },
    });

    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should return 401 if user is already verified', async () => {
    const { sut, readUserUseCase, user } = makeSut();

    const useCaseReturn = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: true,
      roles: [],
    };
    jest.spyOn(readUserUseCase, 'execute').mockResolvedValue(success(useCaseReturn));

    const response = await sut.handle({
      user: {
        id: 'invalid_id',
        accessToken: 'any_accessToken',
      },
    });

    expect(response).toEqual(unauthorized(new UserIsAlreadyVerifiedError()));
  });

  it('Should call VerificationTokenUseCase with correct values', async () => {
    const {
      sut, addVerificationTokenUseCase, idGenerator, user,
    } = makeSut();

    const useCaseSpy = jest.spyOn(addVerificationTokenUseCase, 'execute');

    await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(useCaseSpy).toHaveBeenCalledWith(await idGenerator.generate(), 1);
  });

  it('Should return 500 if VerificationTokenUseCase throws', async () => {
    const { sut, addVerificationTokenUseCase, user } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 403 if user does not exists in VerificationTokenUseCase', async () => {
    const {
      sut, addVerificationTokenUseCase, user,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new NonExistingUserError()),
    )));

    const response = await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(response).toEqual(forbidden(new NonExistingUserError()));
  });

  it('Should call sendVerificationToken with correct values', async () => {
    const {
      sut, sendVerificationToken, idGenerator, addVerificationTokenUseCase, user,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
      userId: await idGenerator.generate(),
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    }));
    const useCaseSpy = jest.spyOn(sendVerificationToken, 'execute');

    await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(useCaseSpy).toHaveBeenCalledWith({
      user: {
        id: await idGenerator.generate(),
        name: makeFakeRequest().body.name,
        email: makeFakeRequest().body.email,
      },
      token: 'any_token',
      expiresInHours: 1,
    });
  });

  it('Should return 400 if sendVerificationToken return an error', async () => {
    const {
      sut, sendVerificationToken, addVerificationTokenUseCase, idGenerator, user,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
      userId: await idGenerator.generate(),
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    }));
    jest.spyOn(sendVerificationToken, 'execute').mockResolvedValue(error(new EmailServiceError()));

    const response = await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(response).toEqual(badRequest(new EmailServiceError()));
  });

  it('Should return 200 on success', async () => {
    const {
      sut, user, addVerificationTokenUseCase, idGenerator, sendVerificationToken,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
      userId: await idGenerator.generate(),
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    }));
    jest.spyOn(sendVerificationToken, 'execute').mockResolvedValue(success(null));

    const response = await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response).toEqual(ok());
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation, user } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(validationSpy).toHaveBeenCalledWith({
      id: user.build().id,
      accessToken: 'any_accessToken',
    });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation, user } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
