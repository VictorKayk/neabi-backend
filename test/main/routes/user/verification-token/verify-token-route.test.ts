import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

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
  jest.spyOn(prisma.token, 'findFirst')
    .mockResolvedValue({
      userId: user.build().id,
      token: 'any_token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000000000000),
      isDeleted: false,
    });
  jest.spyOn(prisma.verificationToken, 'findFirst')
    .mockResolvedValue({
      id: 'any_id',
      token: 'any_token',
    });
  jest.spyOn(prisma.user, 'update').mockResolvedValue({
    ...user.build(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    isVerified: true,
  });
  jest.spyOn(prisma.token, 'updateMany')
    .mockResolvedValue({ count: 1 });

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

// Authorization
const userHasRoles = {
  userId: 'any_userId',
  roleId: 'any_roleId',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  Roles: {
    id: 'any_id',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  },
};
jest.spyOn(prisma.userHasRoles, 'findMany').mockResolvedValue([userHasRoles]);

describe('SendVerificationTokenToUser Route', () => {
  it('Should return 200 on send verify token route success', async () => {
    const { user } = makeSut();

    await request(app).get('/api/user/any_userId/verification/token/any_token')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 403 if user do not exist in send verify token route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    }).mockResolvedValueOnce(null);

    await request(app).get('/api/user/any_userId/verification/token/any_token')
      .set('x-access-token', user.build().accessToken).expect(403);
  });

  it('Should return 401 if user is already verified', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: true,
    });

    await request(app).get('/api/user/any_userId/verification/token/any_token')
      .set('x-access-token', user.build().accessToken).expect(401);
  });

  it('Should return 403 if token do not exist in send verify token route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.verificationToken, 'findFirst').mockResolvedValueOnce(null);

    await request(app).get('/api/user/any_userId/verification/token/any_token')
      .set('x-access-token', user.build().accessToken).expect(403);
  });

  it('Should return 403 if token do not exist in send verify token route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.token, 'findFirst')
      .mockResolvedValue({
        userId: user.build().id,
        token: 'any_token',
        createdAt: new Date(),
        expiresAt: new Date('2020-12-31'),
        isDeleted: false,
      });
    jest.spyOn(prisma.verificationToken, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        token: 'any_token',
      });

    await request(app).get('/api/user/any_userId/verification/token/any_token')
      .set('x-access-token', user.build().accessToken).expect(403);
  });

  it('Should return 500 if send verify token route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    }).mockImplementationOnce(() => { throw new Error(); });

    await request(app).get('/api/user/any_userId/verification/token/any_token')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
