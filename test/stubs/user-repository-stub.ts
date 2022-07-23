import { UserBuilder } from '@/test/builders/user-builder';
import {
  IUserRepositoryData,
  IUserRepositoryReturnData,
  IUserRepository,
  IUserEditableData,
} from '@/use-cases/interfaces';

export const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async findByEmail(email: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findById(id: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData> {
      return {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async updateByEmail(email: string, userData: IUserEditableData):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async updateById(id: string, userData: IUserEditableData):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async deleteById(id: string): Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async readAllUsers(): Promise<IUserRepositoryReturnData[] | []> {
      const user = new UserBuilder();
      return [{
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
    }
  }
  return new UserRepositoryStub();
};
