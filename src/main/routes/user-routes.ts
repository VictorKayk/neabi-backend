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
  makeSendResetUserPasswordTokenToUserController,
  makeVerifyResetUserPasswordTokenController,
} from '@/main/factories/user';
import { authentication, googleLoginAuth, googleLoginAuthCb } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function user(router: Router) {
  router.post('/signup', routerAdapter(makeSignUpController()));
  router.post('/signin', routerAdapter(makeSignInController()));
  router.get('/user/google', googleLoginAuth);
  router.get('/user/google/auth', googleLoginAuthCb, routerAdapter(makeExternalSignInController()));
  router.get('/user', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadUserController()));
  router.get('/user/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeAllReadUsersController()));
  router.get('/user/:userId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadUserByIdController()));
  router.patch('/user', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeUpdateUserController()));
  router.patch('/user/:userId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeUpdateUserByIdController()));
  router.delete('/user', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeDeleteUserController()));
  router.delete('/user/:userId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeDeleteUserByIdController()));
  router.get('/user/reset-password/token', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeSendResetUserPasswordTokenToUserController()));
  router.post('/user/:userId/reset-password/token/:token', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeVerifyResetUserPasswordTokenController()));
}
