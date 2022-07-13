import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeSignUpController } from '@/main/factories/signup';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
}
