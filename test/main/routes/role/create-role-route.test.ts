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

describe('CreateRole Route', () => {
  it('Should return 201 on create role route success', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.role, 'create')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app)
      .post('/api/role')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: 'any_role' })
      .expect(201);
  });

  it('Should return 403 if account already exists on create role route', async () => {
    jest.spyOn(prisma.role, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app)
      .post('/api/role')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: 'any_role' })
      .expect(403);
  });

  it('Should return 500 if create role route throws', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockImplementation(() => { throw new Error(); });

    await request(app)
      .post('/api/role')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: 'any_role' })
      .expect(500);
  });
});
