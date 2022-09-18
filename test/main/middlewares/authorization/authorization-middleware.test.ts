import request from 'supertest';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';
import setupApp from '@/main/config/app';
import { Express } from 'express';

let app: Express;

type SutTypes = {
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const user = new UserBuilder();

  jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
    ...user.build(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: false,
  });

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

describe('Authorization middleware', () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  it('Should return 401 if user does not have the role to access the route', async () => {
    const { user } = makeSut();

    await request(app).get('/api/user').set('x-access-token', user.build().accessToken).expect(401);
  });

  it('Should return 500 if authorization middleware throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.userHasRoles, 'findMany').mockImplementation(() => { throw new Error(); });

    await request(app).get('/api/user')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
