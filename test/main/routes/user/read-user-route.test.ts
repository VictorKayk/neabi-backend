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

describe('ReadUser Route', () => {
  it('Should return 200 on read user route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    await request(app).get('/api/user')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 401 if user do not exist in read user route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }).mockResolvedValue(null);

    await request(app).get('/api/user')
      .set('x-access-token', user.build().accessToken).expect(401);
  });

  it('Should return 500 if read user route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }).mockImplementationOnce(() => { throw new Error(); });

    await request(app).get('/api/user')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
