import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeAddTagToPostController, makeRemoveTagFromPostController } from '@/main/factories/post-has-tag';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function postHasTag(router: Router) {
  router.post('/post/:postId/tag/:tagId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeAddTagToPostController()));
  router.delete('/post/:postId/tag/:tagId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeRemoveTagFromPostController()));
}
