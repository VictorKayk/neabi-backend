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

    jest.spyOn(prisma.roles, 'create').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
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

    jest.spyOn(prisma.roles, 'findFirst').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
    });

    const response = await sut.findByRole('any_role');
    expect(response?.id).toBe('any_id');
    expect(response?.role).toBe('any_role');
    expect(response?.createdAt).toBeTruthy();
  });

  it('Should return null on findByEmail fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.roles, 'findFirst').mockResolvedValue(null);

    const response = await sut.findByRole('any_role');
    expect(response).toBe(null);
  });

  it('Should return an role on findById success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.roles, 'findFirst').mockResolvedValue({
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
    });

    const response = await sut.findById('any_id');
    expect(response?.id).toBe('any_id');
    expect(response?.role).toBe('any_role');
    expect(response?.createdAt).toBeTruthy();
  });

  it('Should return null on findById fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.roles, 'findFirst').mockResolvedValue(null);

    const response = await sut.findById('any_id');
    expect(response).toBe(null);
  });
});
