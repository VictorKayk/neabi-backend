import { IUserRepositoryData, IUserRepository } from '@/use-cases/interfaces';
import prisma from '@/main/config/prisma';

export class UserRepository implements IUserRepository {
  async add(userData: IUserRepositoryData): Promise<IUserRepositoryData> {
    const account = await prisma.user.create({
      data: userData,
    });
    return account;
  }

  async findByEmail(email: string): Promise<IUserRepositoryData | null> {
    const account = prisma.user.findFirst({
      where: {
        email,
      },
    });
    return account;
  }

  async findById(id: string): Promise<IUserRepositoryData | null> {
    const account = prisma.user.findFirst({
      where: {
        id,
      },
    });
    return account;
  }
}
