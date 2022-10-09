import { IUrlRepositoryReturnData, IUrlData } from '@/use-cases/attachment/url/interfaces';

export interface IUrlRepository {
  findByUrl(url: string): Promise<IUrlRepositoryReturnData | null>
  findById(id: string): Promise<IUrlRepositoryReturnData | null>
  add(urlData: IUrlData): Promise<IUrlRepositoryReturnData>
}
