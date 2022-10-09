import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';
import { makeCreateUrlController } from '@/main/factories/attachment/url';

export function url(router: Router) {
  router.post('/attachment/url', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreateUrlController()));
}
