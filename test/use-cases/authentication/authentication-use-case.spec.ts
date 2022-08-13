import { AuthenticationUseCase } from '@/use-cases/authentication';
import { IUserRepository, IDecrypter } from '@/use-cases/user/interfaces';
import { IAuthenticationResponse } from '@/use-cases/authentication/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';
import { UserBuilder } from '@/test/builders/user-builder';
import { makeUserRepository, makeDecrypter } from '@/test/stubs';
import { error } from '@/shared';

type SutTypes = {
  userRepository: IUserRepository,
  decrypter: IDecrypter,
  sut: AuthenticationUseCase,
  user: UserBuilder,
}

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const decrypter = makeDecrypter();
  const sut = new AuthenticationUseCase(userRepository, decrypter);
  const user = new UserBuilder();

  jest.spyOn(userRepository, 'findById').mockResolvedValue({
    ...user.build(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
    roles: [],
  });

  return {
    userRepository,
    decrypter,
    sut,
    user,
  };
};

describe('Authentication Use Case', () => {
  it('Should call Decrypter with correct value', async () => {
    const { sut, user, decrypter } = makeSut();
    const decrypterSpy = jest.spyOn(decrypter, 'decrypt');
    await sut.execute(user.build().accessToken);
    expect(decrypterSpy).toHaveBeenCalledWith(user.build().accessToken);
  });

  it('Should return an error if Decrypter fails', async () => {
    const { sut, user, decrypter } = makeSut();
    jest.spyOn(decrypter, 'decrypt').mockResolvedValue(error(new UnauthorizedError()));
    const response = await sut.execute(user.build().accessToken);
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new UnauthorizedError());
  });

  it('Should throw if Decrypter throws', async () => {
    const { sut, user, decrypter } = makeSut();
    jest.spyOn(decrypter, 'decrypt').mockRejectedValue(new Error());
    const promise = sut.execute(user.build().accessToken);
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user do not exists', async () => {
    const { sut, userRepository, user } = makeSut();
    jest.spyOn(userRepository, 'findById').mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const response = await sut.execute(user.build().accessToken);
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new UnauthorizedError());
  });

  it('Should return an error if accessToken is wrong', async () => {
    const { sut } = makeSut();
    const response = await sut.execute('invalid_token');
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new UnauthorizedError());
  });

  it('Should return accessToken and id on success', async () => {
    const { sut, user } = makeSut();
    const response = await sut.execute(user.build().accessToken);
    const value = response.value as IAuthenticationResponse;
    expect(value.id).toBe(user.build().id);
    expect(value.accessToken).toBe(user.build().accessToken);
  });
});
