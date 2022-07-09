import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';

export interface IController {
  handle(request: IHttpRequest): Promise<IHttpResponse>;
}
