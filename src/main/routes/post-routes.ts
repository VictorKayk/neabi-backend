import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeCreatePostController } from '@/main/factories/post';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function post(router: Router) {
  router.post('/post', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreatePostController()));
}
