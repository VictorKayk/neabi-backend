import { InvalidEmailError } from '@/entities/value-object/errors';
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import { serverError, badRequest } from '@/adapters/utils/http';
import {
  makeExternalSignInUseCase,
  makeFakeRequest,
  makeEncrypter,
  makeValidation,
  makeUniversallyUniqueIdentifierGenerator,
  makeCreateRoleUseCase,
  makeAddRoleToUserUseCase,
  makeReadRoleByRoleNameUseCase,
  makeReadAllRolesFromUserUseCase,
} from '@/test/stubs';
import { UserBuilder } from '@/test/builders/user-builder';
import { error, success } from '@/shared';
import { ExternalSignInController } from '@/adapters/controllers/user/external-sign-in';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';
import { ExistingUserError } from '@/use-cases/user/errors';

type SutTypes = {
  sut: ExternalSignInController,
  validation: IValidation,
  encrypter: IEncrypter,
  useCase: ExternalSignInUseCase,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  readAllRolesFromUser: ReadAllRolesFromUserUseCase,
  createRole: CreateRoleUseCase,
  addRoleToUser: AddRoleToUserUseCase,
  readRoleByRoleName: ReadRoleByRoleNameUseCase,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeExternalSignInUseCase();
  const readAllRolesFromUser = makeReadAllRolesFromUserUseCase();
  const createRole = makeCreateRoleUseCase();
  const addRoleToUser = makeAddRoleToUserUseCase();
  const readRoleByRoleName = makeReadRoleByRoleNameUseCase();
  const sut = new ExternalSignInController(
    validation, useCase, readAllRolesFromUser, createRole, addRoleToUser, readRoleByRoleName,
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
  jest.spyOn(readAllRolesFromUser, 'execute').mockResolvedValue(success([]));
  jest.spyOn(createRole, 'execute').mockResolvedValue(success({
    id: 'any_roleId',
    role: 'any_role',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return {
    sut,
    validation,
    useCase,
    idGenerator,
    encrypter,
    readAllRolesFromUser,
    createRole,
    addRoleToUser,
    readRoleByRoleName,
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

  it('Should not call CreateRoleUseCase if user already have roles', async () => {
    const { sut, createRole, readAllRolesFromUser } = makeSut();

    const roleReturn = {
      id: 'any_roleId',
      role: 'any_role',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(readAllRolesFromUser, 'execute').mockResolvedValue(success([roleReturn]));
    const useCaseSpy = jest.spyOn(createRole, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledTimes(0);
  });

  it('Should call CreateRoleUseCase with correct values', async () => {
    const { sut, createRole } = makeSut();

    const useCaseSpy = jest.spyOn(createRole, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith('user');
  });

  it('Should call AddRoleToUserUseCase with correct values if role does not exists', async () => {
    const { sut, addRoleToUser, idGenerator } = makeSut();

    const useCaseSpy = jest.spyOn(addRoleToUser, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({ userId: await idGenerator.generate(), roleId: 'any_roleId' });
  });

  it('Should call ReadRoleByRoleNameUseCase with correct values if role already exists', async () => {
    const { sut, readRoleByRoleName, createRole } = makeSut();

    jest.spyOn(createRole, 'execute').mockResolvedValue(error(new ExistingUserError()));
    const useCaseSpy = jest.spyOn(readRoleByRoleName, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith('user');
  });

  it('Should call AddRoleToUserUseCase with correct values if role already exists', async () => {
    const {
      sut, addRoleToUser, idGenerator, createRole, readRoleByRoleName,
    } = makeSut();

    jest.spyOn(createRole, 'execute').mockResolvedValue(error(new ExistingUserError()));
    jest.spyOn(readRoleByRoleName, 'execute').mockResolvedValue(success({
      id: 'any_roleId',
      role: 'any_role',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const useCaseSpy = jest.spyOn(addRoleToUser, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({ userId: await idGenerator.generate(), roleId: 'any_roleId' });
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
