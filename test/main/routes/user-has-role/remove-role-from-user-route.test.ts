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
});
jest.spyOn(prisma.role, 'findFirst').mockResolvedValue({
  id: 'any_id',
  role: 'any_role',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
});

describe('RemoveRoleFromUserRoute', () => {
  it('Should return 200 on remove role from user route success', async () => {
    jest.spyOn(prisma.userHasRoles, 'findFirst')
      .mockResolvedValue({
        userId: 'any_userId',
        roleId: 'any_roleId',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });
    jest.spyOn(prisma.userHasRoles, 'update')
      .mockResolvedValue({
        userId: 'any_userId',
        roleId: 'any_roleId',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: true,
      });

    await request(app)
      .delete('/api/user/any_userId/role/any_roleId')
      .set('x-access-token', 'any_encrypted_string')
      .expect(200);
  });

  it('Should return 403 if user does not exists', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...new UserBuilder().build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }).mockResolvedValueOnce(null);

    await request(app)
      .delete('/api/user/any_userId/role/any_roleId')
      .set('x-access-token', 'any_encrypted_string')
      .expect(403);
  });

  it('Should return 403 if role does not exists', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue(null);

    await request(app)
      .delete('/api/user/any_userId/role/any_roleId')
      .set('x-access-token', 'any_encrypted_string')
      .expect(403);
  });

  it('Should return 403 if user does not have the role', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    jest.spyOn(prisma.userHasRoles, 'findFirst').mockResolvedValue(null);

    await request(app)
      .delete('/api/user/any_userId/role/any_roleId')
      .set('x-access-token', 'any_encrypted_string')
      .expect(403);
  });

  it('Should return 500 if remove role from user route throws', async () => {
    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
    jest.spyOn(prisma.userHasRoles, 'findFirst')
      .mockResolvedValue({
        userId: 'any_userId',
        roleId: 'any_roleId',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });
    jest.spyOn(prisma.userHasRoles, 'update').mockImplementation(() => { throw new Error(); });

    await request(app)
      .delete('/api/user/any_userId/role/any_roleId')
      .set('x-access-token', 'any_encrypted_string')
      .expect(500);
  });
});
