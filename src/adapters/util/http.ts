import { IHttpResponse } from '@/adapters/interfaces';
import { ServerError, UnauthorizedError } from '@/adapters/errors';

export const ok = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): IHttpResponse => ({
  statusCode: 201,
  body: data,
});

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const forbidden = (error: Error): IHttpResponse => ({
  statusCode: 403,
  body: {
    name: error.name,
    message: error.message,
  },
});

export const serverError = (error: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});
