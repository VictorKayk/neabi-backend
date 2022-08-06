import { IHttpResponse } from '@/adapters/interfaces';
import { ServerError } from '@/adapters/errors';

export const ok = (data: any): IHttpResponse<any> => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): IHttpResponse<any> => ({
  statusCode: 201,
  body: data,
});

export const badRequest = (error: Error): IHttpResponse<any> => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const unauthorized = (error: Error): IHttpResponse<any> => ({
  statusCode: 401,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const forbidden = (error: Error): IHttpResponse<any> => ({
  statusCode: 403,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const serverError = (error: Error): IHttpResponse<any> => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});
