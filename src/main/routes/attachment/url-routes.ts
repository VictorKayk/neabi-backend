import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';
import { makeCreateUrlController, makeReadUrlByIdController, makeReadAllUrlsController } from '@/main/factories/attachment/url';

export function url(router: Router) {
  router.get('/attachment/url/all', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadAllUrlsController()));
  router.get('/attachment/url/:urlId', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadUrlByIdController()));
  router.post('/attachment/url', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreateUrlController()));
}
