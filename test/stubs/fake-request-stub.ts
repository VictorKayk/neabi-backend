import { UserBuilder } from '@/test/builders/user-builder';
import { IHttpRequest, IHttpRequestAuthenticated } from '@/adapters/interfaces';

export const makeFakeRequest = (): IHttpRequest => {
  const user = new UserBuilder();
  return {
    body: {
      name: user.build().name,
      email: user.build().email,
      password: user.build().password,
      passwordConfirmation: user.build().password,
    },
  };
};

export const makeFakeRequestAuthenticated = (): IHttpRequestAuthenticated => {
  const user = new UserBuilder();
  return {
    id: 'any_id',
    accessToken: 'any_token',
    body: {
      name: user.build().name,
      email: user.build().email,
      password: user.build().password,
    },
  };
};
