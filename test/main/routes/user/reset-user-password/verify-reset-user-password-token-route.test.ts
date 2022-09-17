import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

type SutTypes = {
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const user = new UserBuilder();

  jest.spyOn(prisma.user, 'findFirst')
    .mockResolvedValue({
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

  jest.spyOn(prisma.resetUserPasswordToken, 'findFirst')
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

  return {
    user,
  };
};

jest.mock('@/test/mocks/prisma-client.ts');

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  },
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify() {
    return { id: 'any_id' };
  },
}));

describe('SendResetUserPasswordTokenToUser Route', () => {
  it('Should return 200 on verify reset user password token route success', async () => {
    const { user } = makeSut();

    await request(app).post('/api/user/any_userId/reset-password/token/any_token')
      .set('x-access-token', user.build().accessToken)
      .send({
        password: 'new_password_1',
      })
      .expect(200);
  });

  it('Should return 403 if user do not exist in verify reset user password token route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    }).mockResolvedValueOnce(null);

    await request(app).post('/api/user/any_userId/reset-password/token/any_token')
      .set('x-access-token', user.build().accessToken)
      .send({
        password: 'new_password_1',
      })
      .expect(403);
  });

  it('Should return 403 if token do not exist in verify reset user password token route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.resetUserPasswordToken, 'findFirst').mockResolvedValueOnce(null);

    await request(app).post('/api/user/any_userId/reset-password/token/any_token')
      .set('x-access-token', user.build().accessToken)
      .send({
        password: 'new_password_1',
      })
      .expect(403);
  });

  it('Should return 403 if token has already expired in verify reset user password token route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.token, 'findFirst')
      .mockResolvedValue({
        userId: user.build().id,
        token: 'any_token',
        createdAt: new Date(),
        expiresAt: new Date('2020-12-31'),
        isDeleted: false,
      });
    jest.spyOn(prisma.resetUserPasswordToken, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        token: 'any_token',
      });

    await request(app).post('/api/user/any_userId/reset-password/token/any_token')
      .set('x-access-token', user.build().accessToken)
      .send({
        password: 'new_password_1',
      })
      .expect(403);
  });

  it('Should return 500 if verify reset user password token route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'update').mockImplementationOnce(() => { throw new Error(); });

    await request(app).post('/api/user/any_userId/reset-password/token/any_token')
      .set('x-access-token', user.build().accessToken)
      .send({
        password: 'new_password_1',
      })
      .expect(500);
  });

  it('Should return 400 on update user route if params are invalid', async () => {
    const { user } = makeSut();

    await request(app).post('/api/user/any_userId/reset-password/token/any_token')
      .set('x-access-token', user.build().accessToken)
      .send({
        password: '',
      })
      .expect(400);
  });
});
