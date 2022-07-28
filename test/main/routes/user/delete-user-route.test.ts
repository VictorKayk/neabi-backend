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

describe('DeleteUser Route', () => {
  it('Should return 200 on delete user route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(prisma.user, 'delete').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await request(app).delete('/api/user')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 401 if user do not exist in delete user route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst')
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce(null);

    await request(app).delete('/api/user')
      .set('x-access-token', user.build().accessToken).expect(401);
  });

  it('Should return 500 if delete user route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).mockImplementationOnce(() => { throw new Error(); });

    await request(app).delete('/api/user')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
