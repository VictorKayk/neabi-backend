import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeSignUpController } from '@/main/factories/sign-up';
import { makeSignInController } from '@/main/factories/sign-in';
import { makeReadUserController } from '@/main/factories/read-user';
import { makeAllReadUsersController } from '@/main/factories/read-all-users';
import { makeReadUserByIdController } from '@/main/factories/read-user-by-id';
import { makeUpdateUserController } from '@/main/factories/update-user';
import { makeUpdateUserByIdController } from '@/main/factories/update-user-by-id';
import { makeDeleteUserController } from '@/main/factories/delete-user';
import { makeDeleteUserByIdController } from '@/main/factories/delete-user-by-id';
import { authentication } from '@/main/middlewares';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
  router.post('/signin', routerAdapter(makeSignInController()));
  router.get('/user', authentication, routerAdapter(makeReadUserController()));
  router.get('/user/all', authentication, routerAdapter(makeAllReadUsersController()));
  router.get('/user/:id', authentication, routerAdapter(makeReadUserByIdController()));
  router.patch('/user', authentication, routerAdapter(makeUpdateUserController()));
  router.patch('/user/:id', authentication, routerAdapter(makeUpdateUserByIdController()));
  router.delete('/user', authentication, routerAdapter(makeDeleteUserController()));
  router.delete('/user/:id', authentication, routerAdapter(makeDeleteUserByIdController()));
}
