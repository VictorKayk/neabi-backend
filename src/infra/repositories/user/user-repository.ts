import {
  IUserRepositoryReturnData,
  IUserRepositoryData,
  IUserRepository,
  IUserEditableData,
  IUserDataQuery,
} from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { getUserRoles } from '../utils';

export class UserRepository implements IUserRepository {
  async add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.create({
      data: {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        isVerified: userData.isVerified || false,
      },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    const { UserHasRoles, ...userWithoutUserHasRoles } = user;
    return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
  }

  async findByEmail(email: string): Promise<IUserRepositoryReturnData | null> {
    const user = await prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    if (user) {
      const { UserHasRoles, ...userWithoutUserHasRoles } = user;
      return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
    }
    return null;
  }

  async findById(id: string): Promise<IUserRepositoryReturnData | null> {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    if (user) {
      const { UserHasRoles, ...userWithoutUserHasRoles } = user;
      return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
    }
    return null;
  }

  async updateByEmail(email: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { email },
      data: { ...userData, updatedAt: new Date() },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    const { UserHasRoles, ...userWithoutUserHasRoles } = user;
    return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
  }

  async updateById(id: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { id },
      data: { ...userData, updatedAt: new Date() },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    const { UserHasRoles, ...userWithoutUserHasRoles } = user;
    return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
  }

  async deleteById(id: string): Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    const { UserHasRoles, ...userWithoutUserHasRoles } = user;
    return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
  }

  async readAllUsers({
    id, name, email, role, page,
  }: IUserDataQuery): Promise<IUserRepositoryReturnData[] | []> {
    const users = await prisma.user.findMany({
      where: {
        id: { contains: id, mode: 'insensitive' },
        name: { contains: name, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' },
        UserHasRoles: {
          some: {
            Roles: {
              role: { contains: role, mode: 'insensitive' },
              isDeleted: false,
            },
          },
        },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
      orderBy: { isDeleted: 'asc' },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    return users.map((user: any) => {
      const { UserHasRoles, ...userWithoutUserHasRoles } = user;
      return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
    });
  }
}
