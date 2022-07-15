import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeSignUpController } from '@/main/factories/sign-up';
import { makeSignInController } from '@/main/factories/sign-in';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
  router.post('/signin', routerAdapter(makeSignInController()));
}
