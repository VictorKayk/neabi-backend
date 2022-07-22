import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeSignUpController } from '@/main/factories/sign-up';
import { makeSignInController } from '@/main/factories/sign-in';
import { makeReadUserController } from '@/main/factories/read-user';
import { makeUpdateUserController } from '@/main/factories/update-user';
import { authentication } from '@/main/middlewares';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
  router.post('/signin', routerAdapter(makeSignInController()));
  router.get('/user', authentication, routerAdapter(makeReadUserController()));
  router.patch('/user', authentication, routerAdapter(makeUpdateUserController()));
}
