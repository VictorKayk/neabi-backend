import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeSignUpController } from '@/main/factories/sign-up';
import { makeSignInController } from '@/main/factories/sign-in';
import { makeReadUserController } from '@/main/factories/read-user';
import { makeAllReadUsersController } from '@/main/factories/read-all-users';
import { makeReadUserByIdController } from '@/main/factories/read-user-by-id';
import { makeUpdateUserController } from '@/main/factories/update-user';
import { makeDeleteUserController } from '@/main/factories/delete-user';
import { authentication } from '@/main/middlewares';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
  router.post('/signin', routerAdapter(makeSignInController()));
  router.get('/user', authentication, routerAdapter(makeReadUserController()));
  router.get('/user/all', authentication, routerAdapter(makeAllReadUsersController()));
  router.get('/user/:id', authentication, routerAdapter(makeReadUserByIdController()));
  router.patch('/user', authentication, routerAdapter(makeUpdateUserController()));
  router.delete('/user', authentication, routerAdapter(makeDeleteUserController()));
}
