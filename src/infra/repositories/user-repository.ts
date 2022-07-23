import {
  IUserRepositoryReturnData,
  IUserRepositoryData,
  IUserRepository,
  IUserEditableData,
} from '@/use-cases/interfaces';
import prisma from '@/main/config/prisma';

export class UserRepository implements IUserRepository {
  async add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData> {
    const account = await prisma.user.create({
      data: userData,
    });
    return account;
  }

  async findByEmail(email: string): Promise<IUserRepositoryReturnData | null> {
    const account = prisma.user.findFirst({
      where: {
        email,
      },
    });
    return account;
  }

  async findById(id: string): Promise<IUserRepositoryReturnData | null> {
    const account = prisma.user.findFirst({
      where: {
        id,
      },
    });
    return account;
  }

  async updateByEmail(email: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = prisma.user.update({
      where: { email },
      data: userData,
    });
    return user;
  }

  async updateById(id: string, userData: IUserEditableData):
    Promise<IUserRepositoryReturnData> {
    const user = prisma.user.update({
      where: { id },
      data: userData,
    });
    return user;
  }

  async deleteById(id: string): Promise<IUserRepositoryReturnData> {
    const user = prisma.user.delete({
      where: { id },
    });
    return user;
  }
}
