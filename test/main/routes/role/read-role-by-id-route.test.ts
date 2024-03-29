import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

jest.mock('@/test/mocks/prisma-client.ts');

// Authentication
jest.mock('bcrypt', () => ({
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
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

jest.mock('jsonwebtoken', () => ({
  verify() {
    return { id: 'any_id' };
  },
}));

jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
  ...new UserBuilder().build(),
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  isVerified: false,
});

describe('ReadRoleById Route', () => {
  it('Should return 200 on read role by id route success', async () => {
    jest.spyOn(prisma.role, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app).get('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .expect(200);
  });

  it('Should return 401 if role do not exist in read role by id route', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue(null);

    await request(app).get('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .expect(401);
  });

  it('Should return 500 if read role by id route throws', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockImplementationOnce(() => { throw new Error(); });

    await request(app).get('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .expect(500);
  });
});
