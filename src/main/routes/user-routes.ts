import { Router } from 'express';

import { routerAdapter } from '@/main/adapters/express';
import {
  makeAllReadUsersController,
  makeDeleteUserByIdController,
  makeDeleteUserController,
  makeExternalSignInController,
  makeReadUserByIdController,
  makeReadUserController,
  makeSignInController,
  makeSignUpController,
  makeUpdateUserByIdController,
  makeUpdateUserController,
} from '@/main/factories/user';
import { authentication, googleLoginAuth, googleLoginAuthCb } from '@/main/middlewares/user';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
  router.post('/signin', routerAdapter(makeSignInController()));
  router.get('/user/google', googleLoginAuth);
  router.get('/user/google/auth', googleLoginAuthCb, routerAdapter(makeExternalSignInController()));
  router.get('/user', authentication, routerAdapter(makeReadUserController()));
  router.get('/user/all', authentication, routerAdapter(makeAllReadUsersController()));
  router.get('/user/:id', authentication, routerAdapter(makeReadUserByIdController()));
  router.patch('/user', authentication, routerAdapter(makeUpdateUserController()));
  router.patch('/user/:id', authentication, routerAdapter(makeUpdateUserByIdController()));
  router.delete('/user', authentication, routerAdapter(makeDeleteUserController()));
  router.delete('/user/:id', authentication, routerAdapter(makeDeleteUserByIdController()));
}
