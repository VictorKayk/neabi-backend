import { middlewareAdapter } from '@/main/adapters/express';
import { makeAuthenticationMiddleware } from '@/main/factories/user';

export const authentication = middlewareAdapter(makeAuthenticationMiddleware());
