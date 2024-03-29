import { SendEmailService } from '@/use-cases/services/email-service/send-email';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { SendVerificationTokenToUserController } from '@/adapters/controllers/user/verification-token/send-verification-token-to-user';
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
  makeEncrypter,
  makeUniversallyUniqueIdentifierGenerator,
  makeValidation,
  makeAddVerificationTokenUseCase,
  makeSendEmailService,
  makeUserRepository,
} from '@/test/stubs';
import { error, success } from '@/shared';
import { AddVerificationTokenUseCase } from '@/use-cases/user/verification-token/add-verification-token';
import { EmailServiceError } from '@/use-cases/services/email-service/errors';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { UserBuilder } from '@/test/builders';
import { UserIsAlreadyVerifiedError } from '@/use-cases/user/verification-token/errors';

type SutTypes = {
  sut: SendVerificationTokenToUserController,
  validation: IValidation,
  readUserUseCase: ReadUserUseCase,
  addVerificationTokenUseCase: AddVerificationTokenUseCase,
  sendEmailService: SendEmailService,
  user: UserBuilder,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  encrypter: IEncrypter,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const repository = makeUserRepository();
  const readUserUseCase = new ReadUserUseCase(repository);
  const addVerificationTokenUseCase = makeAddVerificationTokenUseCase();
  const sendEmailService = makeSendEmailService();

  const sut = new SendVerificationTokenToUserController(
    validation, addVerificationTokenUseCase, readUserUseCase, sendEmailService, 'http://test.url',
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
  jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
    verificationToken: {
      userId: 'any_userId',
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(),
      isDeleted: false,
    },
    token: 'any_token',
  }));

  return {
    sut,
    validation,
    readUserUseCase,
    addVerificationTokenUseCase,
    sendEmailService,
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

  it('Should call sendEmailService', async () => {
    const {
      sut, sendEmailService, idGenerator, addVerificationTokenUseCase, user,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
      verificationToken: {
        userId: await idGenerator.generate(),
        token: 'any_hashToken',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      },
      token: 'any_token',
    }));
    const useCaseSpy = jest.spyOn(sendEmailService, 'execute');

    await sut.handle({
      user: {
        id: user.build().id,
        accessToken: 'any_accessToken',
      },
    });
    expect(useCaseSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return 400 if sendEmailService return an error', async () => {
    const {
      sut, sendEmailService, addVerificationTokenUseCase, idGenerator, user,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
      verificationToken: {
        userId: await idGenerator.generate(),
        token: 'any_hashToken',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      },
      token: 'any_token',
    }));
    jest.spyOn(sendEmailService, 'execute').mockResolvedValue(error(new EmailServiceError()));

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
      sut, user, addVerificationTokenUseCase, idGenerator, sendEmailService,
    } = makeSut();

    jest.spyOn(addVerificationTokenUseCase, 'execute').mockResolvedValue(success({
      verificationToken: {
        userId: await idGenerator.generate(),
        token: 'any_hashToken',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      },
      token: 'any_token',
    }));
    jest.spyOn(sendEmailService, 'execute').mockResolvedValue(success(null));

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
