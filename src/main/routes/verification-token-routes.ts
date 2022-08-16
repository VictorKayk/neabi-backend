import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeSendVerificationTokenToUserController, makeVerifyTokenController } from '@/main/factories/verification-token';
import { authentication } from '@/main/middlewares/authentication';

export function sendVerificationTokenToUser(router: Router) {
  router.get('/user/verification/token', authentication, routerAdapter(makeSendVerificationTokenToUserController()));
  router.get('/user/:userId/verification/token/:token', authentication, routerAdapter(makeVerifyTokenController()));
}
