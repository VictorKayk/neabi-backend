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

describe('UpdateRoleById Route', () => {
  it('Should return 200 on update role by id route success', async () => {
    jest.spyOn(prisma.role, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    jest.spyOn(prisma.role, 'update')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app).patch('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: 'new_role' })
      .expect(200);
  });

  it('Should return 400 on update role by id route if params are invalid', async () => {
    jest.spyOn(prisma.role, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app).patch('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: '' })
      .expect(400);
  });

  it('Should return 401 on update role by id route if params are invalid', async () => {
    jest.spyOn(prisma.role, 'findFirst')
      .mockResolvedValueOnce({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      })
      .mockResolvedValueOnce({
        id: 'invalid_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app).patch('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: 'any_role' })
      .expect(401);
  });

  it('Should return 500 if update role by id route throws', async () => {
    jest.spyOn(prisma.role, 'findFirst')
      .mockResolvedValue({
        id: 'any_id',
        role: 'any_role',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });
    jest.spyOn(prisma.role, 'update').mockImplementationOnce(() => { throw new Error(); });

    await request(app).patch('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .send({ role: 'any_role' })
      .expect(500);
  });
});
