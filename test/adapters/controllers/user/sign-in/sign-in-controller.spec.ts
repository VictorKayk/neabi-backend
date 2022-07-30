import { InvalidEmailError } from '@/entities/value-object/errors';
import { SignInUseCase } from '@/use-cases/user/sign-in';
import { IHashCompare, IEncrypter } from '@/use-cases/user/interfaces';
import { InvalidEmailOrPasswordError } from '@/use-cases/user/errors';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import { serverError, badRequest, unauthorized } from '@/adapters/util/http';
import {
  makeSignInUseCase,
  makeFakeRequest,
  makeHashCompare,
  makeEncrypter,
  makeValidation,
} from '@/test/stubs';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { SignInController } from '@/adapters/controllers/user/sign-in';

type SutTypes = {
  sut: SignInController,
  validation: IValidation,
  useCase: SignInUseCase,
  hashCompare: IHashCompare,
  encrypter: IEncrypter,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeSignInUseCase();
  const sut = new SignInController(validation, useCase);
  const hashCompare = makeHashCompare();
  const encrypter = makeEncrypter();
  const user = new UserBuilder();

  jest.spyOn(useCase, 'execute')
    .mockResolvedValue(success({ ...user.build(), createdAt: new Date(), updatedAt: new Date() }));

  return {
    sut,
    validation,
    useCase,
    hashCompare,
    encrypter,
  };
};

describe('SignInUseCase Controller ', () => {
  it('Should call SignInUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({
      email: makeFakeRequest().body.email,
      password: makeFakeRequest().body.password,
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

  it('Should return 400 if call SignInUseCase with incorrect values', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockResolvedValue(error(new InvalidEmailError('')));

    const response = await sut.handle({
      body: {
        email: '',
        password: makeFakeRequest().body.password,
      },
    });
    expect(response).toEqual(badRequest(new InvalidEmailError('')));
  });

  it('Should return 401 if user do not exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new InvalidEmailOrPasswordError(
        makeFakeRequest().body.email, makeFakeRequest().body.password,
      )),
    )));

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(unauthorized(new InvalidEmailOrPasswordError(
      makeFakeRequest().body.email, makeFakeRequest().body.password,
    )));
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
