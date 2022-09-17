import { middlewareAdapter } from '@/main/adapters/express';
import { makeAuthorizationMiddleware } from '@/main/factories/authorization';

export const authorization = (allowedRoles: Array<string>) => middlewareAdapter(
  makeAuthorizationMiddleware(allowedRoles),
);
