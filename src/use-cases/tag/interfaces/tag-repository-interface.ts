import {
  ITagData, ITagRepositoryReturnData, ITagEditableData,
} from '@/use-cases/tag/interfaces';

export interface ITagRepository {
  findByTag(tag: string): Promise<ITagRepositoryReturnData | null>
  findById(id: string): Promise<ITagRepositoryReturnData | null>
  updateById(id: string, tagEditableData: ITagEditableData): Promise<ITagRepositoryReturnData>
  add(tagData: ITagData): Promise<ITagRepositoryReturnData>
}
