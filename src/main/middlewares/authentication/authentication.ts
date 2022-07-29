import { middlewareAdapter } from '@/main/adapters/express';
import { makeAuthenticationMiddleware } from '@/main/factories/authentication';

export const authentication = middlewareAdapter(makeAuthenticationMiddleware());
