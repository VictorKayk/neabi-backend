import { IHttpResponse } from '@/adapters/interfaces';

export interface IMiddleware<T = any> {
  handle(request: T): Promise<IHttpResponse>;
}
