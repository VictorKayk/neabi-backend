import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

type SutTypes = {
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const user = new UserBuilder();
  return {
    user,
  };
};

jest.mock('@/test/mocks/prisma-client.ts');

jest.mock('bcrypt', () => ({
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify() {
    return { id: 'any_id' };
  },
}));

describe('Authentication middleware', () => {
  it('Should return 401 if accessToken is invalid', async () => {
    await request(app).get('/api/user').set('x-access-token', 'invalid_token').expect(401);
  });

  it('Should return 500 if sign up route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockImplementation(() => { throw new Error(); });

    await request(app).get('/api/user')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
