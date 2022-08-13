import { InvalidEmailError } from '@/entities/value-object/errors';
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import { serverError, badRequest, ok } from '@/adapters/util/http';
import {
  makeExternalSignInUseCase,
  makeFakeRequest,
  makeEncrypter,
  makeValidation,
  makeAddVerificationTokenUseCase,
  makeSendVerificationTokenUseCase,
  makeUniversallyUniqueIdentifierGenerator,
} from '@/test/stubs';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { ExternalSignInController } from '@/adapters/controllers/user/external-sign-in';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';
import { SendVerificationTokenUseCase } from '@/use-cases/email-service/send-verification-token';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { EmailServiceError } from '@/use-cases/email-service/errors';

type SutTypes = {
  sut: ExternalSignInController,
  validation: IValidation,
  encrypter: IEncrypter,
  useCase: ExternalSignInUseCase,
  addVerificationTokenUseCase: AddVerificationTokenUseCase,
  sendVerificationToken: SendVerificationTokenUseCase,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeExternalSignInUseCase();
  const addVerificationTokenUseCase = makeAddVerificationTokenUseCase();
  const sendVerificationToken = makeSendVerificationTokenUseCase();
  const sut = new ExternalSignInController(
    validation, useCase, addVerificationTokenUseCase, sendVerificationToken,
  );
  const encrypter = makeEncrypter();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const user = new UserBuilder();

  jest.spyOn(useCase, 'execute')
    .mockResolvedValue(success({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
      roles: [],
    }));

  return {
    sut,
    validation,
    addVerificationTokenUseCase,
    sendVerificationToken,
    useCase,
    idGenerator,
    encrypter,
  };
};

describe('ExternalSignInUseCase Controller ', () => {
  it('Should call ExternalSignInUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({ body: { ...makeFakeRequest().body, email_verified: true } });
    expect(useCaseSpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      isVerified: true,
    });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({
      body: { ...makeFakeRequest().body, email_verified: true },
    });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, encrypter } = makeSut();
    const response = await sut.handle({
      body: { ...makeFakeRequest().body, email_verified: true },
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(makeFakeRequest().body.name);
    expect(response.body.email).toBe(makeFakeRequest().body.email);
    expect(response.body.accessToken).toBe(await encrypter.encrypt(response.body.id));
  });

  it('Should return 400 if call ExternalSignInUseCase with incorrect values', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new InvalidEmailError('')));

    const response = await sut.handle({
      body: {
        name: makeFakeRequest().body.name,
        email: '',
      },
    });
    expect(response).toEqual(badRequest(new InvalidEmailError('')));
  });

  describe('If external user is not verified', () => {
    it('Should call VerificationTokenUseCase with correct values', async () => {
      const { sut, addVerificationTokenUseCase, idGenerator } = makeSut();

      const useCaseSpy = jest.spyOn(addVerificationTokenUseCase, 'execute');

      await sut.handle({
        body: { ...makeFakeRequest().body, email_verified: true },
      });
      expect(useCaseSpy).toHaveBeenCalledWith(await idGenerator.generate(), 1);
    });

    it('Should return 500 if VerificationTokenUseCase throws', async () => {
      const { sut, addVerificationTokenUseCase } = makeSut();

      jest.spyOn(addVerificationTokenUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

      const response = await sut.handle({
        body: { ...makeFakeRequest().body, email_verified: true },
      });
      expect(response).toEqual(serverError(new ServerError()));
    });

    it('Should return 200 and an error message if user does not exists in VerificationTokenUseCase', async () => {
      const {
        sut, addVerificationTokenUseCase, idGenerator, encrypter,
      } = makeSut();

      jest.spyOn(addVerificationTokenUseCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
        error(new NonExistingUserError()),
      )));

      const response = await sut.handle({
        body: { ...makeFakeRequest().body, email_verified: true },
      });
      expect(response).toEqual(ok({
        id: await idGenerator.generate(),
        name: makeFakeRequest().body.name,
        email: makeFakeRequest().body.email,
        isVerified: false,
        accessToken: await encrypter.encrypt(await idGenerator.generate()),
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
        error: new NonExistingUserError(),
      }));
    });

    it('Should call sendVerificationToken with correct values', async () => {
      const {
        sut, sendVerificationToken, idGenerator, addVerificationTokenUseCase,
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
        body: { ...makeFakeRequest().body, email_verified: true },
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

    it('Should return 200 and an error message if sendVerificationToken return an error', async () => {
      const {
        sut, sendVerificationToken, addVerificationTokenUseCase, idGenerator, encrypter,
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
        body: { ...makeFakeRequest().body, email_verified: true },
      });
      expect(response).toEqual(ok({
        id: await idGenerator.generate(),
        name: makeFakeRequest().body.name,
        email: makeFakeRequest().body.email,
        isVerified: false,
        accessToken: await encrypter.encrypt(await idGenerator.generate()),
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
        error: new EmailServiceError(),
      }));
    });
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ body: { ...makeFakeRequest().body, email_verified: true } });
    expect(validationSpy).toHaveBeenCalledWith({ ...makeFakeRequest().body, email_verified: true });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({
      body: { ...makeFakeRequest().body, email_verified: true },
    });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
