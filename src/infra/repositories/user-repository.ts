import {
  IUserRepositoryReturnData,
  IUserRepositoryData,
  IUserRepository,
  IUserEditableData,
} from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';

export class UserRepository implements IUserRepository {
  async add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData> {
    const account = await prisma.user.create({
      data: userData,
      include: { UserHasRoles: true },
    });
    return account;
  }

  async findByEmail(email: string): Promise<IUserRepositoryReturnData | null> {
    const account = prisma.user.findFirst({
      where: { email },
      include: { UserHasRoles: true },
    });
    return account;
  }

  async findById(id: string): Promise<IUserRepositoryReturnData | null> {
    const account = prisma.user.findFirst({
      where: { id },
      include: { UserHasRoles: true },
    });
    return account;
  }

  async updateByEmail(email: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = prisma.user.update({
      where: { email },
      data: userData,
      include: { UserHasRoles: true },
    });
    return user;
  }

  async updateById(id: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = prisma.user.update({
      where: { id },
      data: userData,
      include: { UserHasRoles: true },
    });
    return user;
  }

  async deleteById(id: string): Promise<IUserRepositoryReturnData> {
    const user = prisma.user.delete({
      where: { id },
      include: { UserHasRoles: true },
    });
    return user;
  }

  async readAllUsers(): Promise<IUserRepositoryReturnData[] | []> {
    const user = prisma.user.findMany({
      include: { UserHasRoles: true },
    });
    return user;
  }
}
