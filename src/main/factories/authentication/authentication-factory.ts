import { AuthenticationMiddleware } from '@/adapters/middleware/authentication-middleware';
import { Authentication } from '@/use-cases/authentication';
import { IMiddleware } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';
import { JwtAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeAuthenticationMiddleware(): IMiddleware {
  const userRepository = new UserRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const authenticationUseCase = new Authentication(userRepository, jwtAdapter);
  const authenticationMiddleware = new AuthenticationMiddleware(authenticationUseCase);
  return authenticationMiddleware;
}
