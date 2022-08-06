import { RoleRepository } from '@/infra/repositories';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: RoleRepository,
};

const makeSut = (): SutTypes => {
  const sut = new RoleRepository();

  return {
    sut,
  };
};

describe('Role Repository Implementation', () => {
  it('Should return an role on add success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'create').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.add({
      id: 'any_id',
      role: 'any_role',
    });
    expect(response.id).toBe('any_id');
    expect(response.role).toBe('any_role');
    expect(response.createdAt).toBeTruthy();
  });

  it('Should return an role on findByRole success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.findByRole('any_role');
    expect(response?.id).toBe('any_id');
    expect(response?.role).toBe('any_role');
    expect(response?.createdAt).toBeTruthy();
  });

  it('Should return null on findByRole fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue(null);

    const response = await sut.findByRole('any_role');
    expect(response).toBe(null);
  });

  it('Should return an role on findById success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.findById('any_id');
    expect(response?.id).toBe('any_id');
    expect(response?.role).toBe('any_role');
    expect(response?.createdAt).toBeTruthy();
  });

  it('Should return null on findById fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.role, 'findFirst').mockResolvedValue(null);

    const response = await sut.findById('any_id');
    expect(response).toBe(null);
  });

  it('Should return all roles on readAllRoles success', async () => {
    const { sut } = makeSut();

    const role = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(prisma.role, 'findMany').mockResolvedValue([role, role, role]);

    const response = await sut.readAllRoles({});
    expect(response).toEqual([role, role, role]);
  });

  it('Should return all roles with correct name on readAllRoles success', async () => {
    const { sut } = makeSut();

    const role = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(prisma.role, 'findMany').mockResolvedValue([role, role, role]);

    const response = await sut.readAllRoles({ role: 'any' });
    expect(response).toEqual([role, role, role]);
  });

  it('Should return an role on deleteById success', async () => {
    const { sut } = makeSut();

    const role = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
    };
    jest.spyOn(prisma.role, 'update').mockResolvedValue(role);

    const response = await sut.deleteById('any_id');
    expect(response).toEqual(role);
  });

  it('Should return an role on updateById success', async () => {
    const { sut } = makeSut();

    const role = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(prisma.role, 'update').mockResolvedValue(role);

    const response = await sut.updateById({ id: 'any_id', role: 'any_role' });
    expect(response).toEqual(role);
  });
});
