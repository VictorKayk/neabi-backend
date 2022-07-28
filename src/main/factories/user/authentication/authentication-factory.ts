import { AuthenticationMiddleware } from '@/adapters/middleware/user/authentication-middleware';
import { AuthenticationUseCase } from '@/use-cases/user/authentication';
import { IMiddleware } from '@/adapters/middleware/interfaces';
import { UserRepository } from '@/infra/repositories';
import { JwtAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeAuthenticationMiddleware(): IMiddleware {
  const userRepository = new UserRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const authenticationUseCase = new AuthenticationUseCase(userRepository, jwtAdapter);
  const authenticationMiddleware = new AuthenticationMiddleware(authenticationUseCase);
  return authenticationMiddleware;
}
