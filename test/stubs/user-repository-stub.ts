import { UserBuilder } from '@/test/builders/user-builder';
import {
  IUserRepositoryData,
  IUserRepositoryReturnData,
  IUserRepository,
  IUserEditableData,
} from '@/use-cases/user/interfaces';

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
        isDeleted: false,
        roles: [],
      };
    }

    async updateByEmail(email: string, userData: IUserEditableData):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        roles: [],
      };
    }

    async updateById(id: string, userData: IUserEditableData):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        roles: [],
      };
    }

    async deleteById(id: string): Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: true,
        roles: [],
      };
    }

    async readAllUsers(): Promise<IUserRepositoryReturnData[] | []> {
      const user = new UserBuilder();
      return [{
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        roles: [],
      },
      {
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        roles: [],
      }];
    }
  }
  return new UserRepositoryStub();
};
