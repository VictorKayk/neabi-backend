import { InvalidEmailError } from '@/entities/value-object/errors';
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import { serverError, badRequest } from '@/adapters/util/http';
import {
  makeExternalSignInUseCase,
  makeFakeRequest,
  makeEncrypter,
  makeValidation,
} from '@/test/stubs';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { ExternalSignInController } from '@/adapters/controllers/user/external-sign-in';

type SutTypes = {
  sut: ExternalSignInController,
  validation: IValidation,
  encrypter: IEncrypter,
  useCase: ExternalSignInUseCase,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeExternalSignInUseCase();
  const sut = new ExternalSignInController(validation, useCase);
  const encrypter = makeEncrypter();
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
    useCase,
    encrypter,
  };
};

describe('ExternalSignInUseCase Controller ', () => {
  it('Should call ExternalSignInUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
    });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 200 on success', async () => {
    const { sut, encrypter } = makeSut();
    const response = await sut.handle(makeFakeRequest());
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

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle(makeFakeRequest());
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
