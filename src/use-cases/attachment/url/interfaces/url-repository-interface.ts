import { IUrlRepositoryReturnData, IUrlData, IUrlDataQuery } from '@/use-cases/attachment/url/interfaces';
import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';

export interface IUrlRepository {
  findAttachmentById(id: string): Promise<IAttachmentRepositoryReturnData | null>
  findByUrl(url: string): Promise<IUrlRepositoryReturnData | null>
  findById(id: string): Promise<IUrlRepositoryReturnData | null>
  add(urlData: IUrlData): Promise<IUrlRepositoryReturnData>
  readAllUrls(urlDataQuery: IUrlDataQuery): Promise<IUrlRepositoryReturnData[] | []>
}
