import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import {
  makeCreateTagController, makeReadAllTagsController, makeReadTagByIdController,
} from '@/main/factories/tag';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function tag(router: Router) {
  router.post('/tag', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreateTagController()));
  router.get('/tag/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllTagsController()));
  router.get('/tag/:id', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadTagByIdController()));
}
