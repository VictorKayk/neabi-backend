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

describe('ReadAllUsers Route', () => {
  it('Should return 200 on read all users route success', async () => {
    const { user } = makeSut();
    const userData = {
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    };

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(userData);
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([userData, userData]);

    await request(app).get('/api/user/all')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 500 if read all users route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    });
    jest.spyOn(prisma.user, 'findMany').mockImplementationOnce(() => { throw new Error(); });

    await request(app).get('/api/user/all')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
