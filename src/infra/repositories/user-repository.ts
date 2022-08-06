import {
  IUserRepositoryReturnData,
  IUserRepositoryData,
  IUserRepository,
  IUserEditableData,
  IUserDataQuery,
} from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { getUserRoles } from './utils';

export class UserRepository implements IUserRepository {
  async add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.create({
      data: {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return { ...user, roles: getUserRoles(user.userHasRoles) };
  }

  async findByEmail(email: string): Promise<IUserRepositoryReturnData | null> {
    const user = await prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return user ? { ...user, roles: getUserRoles(user.userHasRoles) } : null;
  }

  async findById(id: string): Promise<IUserRepositoryReturnData | null> {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return user ? { ...user, roles: getUserRoles(user.userHasRoles) } : null;
  }

  async updateByEmail(email: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { email },
      data: { ...userData, updatedAt: new Date() },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return { ...user, roles: getUserRoles(user.userHasRoles) };
  }

  async updateById(id: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { id },
      data: { ...userData, updatedAt: new Date() },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return { ...user, roles: getUserRoles(user.userHasRoles) };
  }

  async deleteById(id: string): Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return { ...user, roles: getUserRoles(user.userHasRoles) };
  }

  async readAllUsers({
    id, name, email, role, page,
  }: IUserDataQuery): Promise<IUserRepositoryReturnData[] | []> {
    const users = await prisma.user.findMany({
      where: {
        id: { contains: id, mode: 'insensitive' },
        name: { contains: name, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' },
        userHasRoles: { some: { roles: { role: { contains: role, mode: 'insensitive' } } } },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 1,
      orderBy: { isDeleted: 'asc' },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return users.map((user) => ({ ...user, roles: getUserRoles(user.userHasRoles) }));
  }
}
